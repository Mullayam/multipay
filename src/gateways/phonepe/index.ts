import axios from "axios";
import { Utils } from '../../utils';
import { PhonePeConfigurationValidator, WebhookResponse, PhonePeInitiateTransaction } from '../../types/phonepe';
import { Logging } from "../../logger";
export class PhonePe {

    private config: PhonePeConfigurationValidator
    constructor(config: PhonePeConfigurationValidator) {
        this.config = config
    }
    async InitiateTransaction({
        orderid,
        amount,
        info: {
            mobile
        }
    }: PhonePeInitiateTransaction) {
        try {
            if (!this.config) {
                throw new Error('PhonePe config not found');
            }

            const requestData = {
                merchantId: this.config.mid,
                merchantTransactionId: orderid,
                merchantUserId: "random",
                amount,
                redirectUrl: this.config.redirectUrl,
                redirectMode: 'REDIRECT',
                callbackUrl: this.config.callbackUrl,
                mobileNumber: mobile,
                paymentInstrument: {
                    type: 'PAY_PAGE'
                },
            };
            const payload = JSON.stringify(requestData);
            const payloadMain = btoa(payload);

            const string = payloadMain + '/pg/v1/pay' + this.config.salt_key;
            const hash = await Utils.sha256(string)
            const checksum = hash + '###' + this.config.salt_index || 1;


            const URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay" //UAT HOST URL
            const options = {
                method: 'POST',
                url: URL,
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-VERIFY': checksum
                },
                data: {
                    request: payloadMain
                }
            };

            return axios
                .request(options)
                .then(response => response.data.data)
                .catch(function (error) {
                    Logging.dev("Error details: " + error.response.data, "error");
                    return error.response.data;
                });

        } catch (error: any) {
            if (error.response) {
                Logging.dev("Error details: " + error.response, "error");
            }
            return error.response
        }
    }
    WebhookResponse() { }
    async VerifyPaymentStatus() {
        try {
            const string = `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${this.config.mid}/${"merchantTransactionId"}`;

            const hash = await Utils.sha256(`/pg/v1/status/${this.config.mid}/${"merchantTransactionId"}` + this.config.salt_key)
            const checksum = hash + '###' + this.config.salt_index || 1;
            const options = {
                method: 'GET',
                url: string,
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-VERIFY': checksum,
                    'X-MERCHANT-ID': this.config.mid,
                },
            };

            return axios.request(options).then(response => response.data).catch(err => err.response.data)


        } catch (error) {

        }
    }
    private decodeBase64ToObject(base64String: string) {
        try {
            const decodedString = Buffer.from(base64String, 'base64').toString('utf-8');
            const decodedObject = JSON.parse(decodedString);
            return decodedObject;
        } catch (error) {
            console.error("Error decoding base64 string:", error);
            return null;
        }
    }
}