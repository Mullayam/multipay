
import { BillDeskConfigurationValidator, BillDeskInitiateTransaction, BillDeskIniTxnResponse, TransactionResponsePayload } from "../../types/billdesk";
import { Utils } from "../../utils";
import * as crypto from "crypto";
import axios from "axios";
import moment from "moment";
import { jwtDecode } from "jwt-decode";
import { Logging } from "../../logger";
export class BillDesk {
    private URLs = {
        SANDBOX_URL: "https://uat1.billdesk.com/u2/payments/ve1_2/orders/create",
        API_URL: "https://api.billdesk.com/payments/ve1_2/orders/create",
        ORDER_STATUS_URL: "https://api.billdesk.com/payments/ve1_2/transactions/get"
    }
    constructor(private config: BillDeskConfigurationValidator) {
        this.config = config
    }

    async InitiateTransaction({ orderid, amount, info, ip, ua }: BillDeskInitiateTransaction) {
        try {
            const order_date = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss+05:30");
            const payload = {
                mercid: this.config.mercid,
                orderid,
                childWindow: "false",
                flowType: "payments",
                amount,
                order_date,
                currency: "356",
                ru: this.config.ru,
                itemcode: "DIRECT",
                additional_info: info || {},
                device: {
                    init_channel: "internet",
                    ip: ip || "13.235.91.109",
                    mac: "11-AC-58-21-1B-AA",
                    imei: "990000112233445",
                    user_agent:
                        ua || "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:51.0)Gecko/20100101 Firefox/51.0",
                    accept_header: "text/html",
                    fingerprintid: "61b12c18b5d0cf901be34a23ca64bb19",
                },
            };

            const customTokenHeader = {
                alg: "HS256",
                clientid: this.config.clientid,
                kid: "HMAC",
            };
            const EncodedHeader = Utils.base64UrlEncode(customTokenHeader);
            const EncodedPayload = Utils.base64UrlEncode(payload);
            // generating signature
            const Signature = crypto
                .createHmac("sha256", this.config.secret_key!)
                .update(`${EncodedHeader}.${EncodedPayload}`)
                .digest("base64")
                .replace(/=/g, "")
                .replace(/\+/g, "-")
                .replace(/\//g, "_");
            // prepare custom jwt token
            const Token = `${EncodedHeader}.${EncodedPayload}.${Signature}`;
            // headers
            const header = {
                "content-type": "application/jose",
                accept: "application/jose",
                alg: "HS256",
                clientid: this.config.clientid,
                "bd-traceid": `tr-${Utils.createDateTime()}`,
                "bd-timestamp": Utils.createDateTime(),
            };
            const URL = this.config.mode === "SANDBOX" ? this.URLs.SANDBOX_URL : this.URLs.API_URL
            let { data } = await axios.post(URL, Token, { headers: header });
            const { bdorderid, mercid, ru, ...rest } = jwtDecode(data) as BillDeskIniTxnResponse
            const OToken = (rest.links as any[]).pop().headers.authorization as any;
            return {
                orderid,
                OToken,
                bdorderid,
                mid: mercid,
                redirect_url: ru
            }
        } catch (error: any) {
            Logging.dev(error.message, "error")
            if (error instanceof Error) {
                return error.message
            }

            return "Something Went Wrong"
        }
    }
    async WebhookResponse(orderid: string, transaction_response: string): Promise<TransactionResponsePayload> {
        const payment = jwtDecode(transaction_response) as TransactionResponsePayload
        payment.orderid = orderid
        return payment
    }
}