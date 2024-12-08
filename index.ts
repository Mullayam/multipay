/// <reference path="./src/gateways/paytm/index.ts" />
/// <reference path="./src/gateways/phonepe/index.ts" />
/// <reference path="./src/gateways/razorpay/index.ts" />
/// <reference path="./src/gateways/bill-desk/index.ts" />
import { Logging } from "./src/logger";
import { DefaultConfig, Config, InitiateTransactionProps, ORDER_ID, UserInfoBody, ClassConstructor } from "./src/types";
import { Paytm } from './src/gateways/paytm/index';
import { BillDesk } from "./src/gateways/bill-desk";
import { Razorpay } from "./src/gateways/razorpay";
import { PhonePe } from "./src/gateways/phonepe";
import { PaytmSDK } from "./src/gateways/paytm/index2";
import { Abstract } from "./src/gateways/abstract";
import { Utils } from "./src/utils";


export namespace PaymentProvider {

    export class Factory extends Abstract {
        constructor(private config: Config) {
            super();
            Logging.dev("Initializing FlexiPay")
            Logging.dev("v" + this.VERSION)
        }
        /**
                * Initializes the transaction as per the configuration passed in the constructor
         * @description
         * This function will initialize the transaction and set up the necessary
         * configurations to use the gateway for payment processing
         * @example
         * const paymentInstance = new PaymentProvider.Config({
         *      mode: "PRODUCTION",
         *      gateway: "PAYTM",
         *      redirectUrl: "http://localhost:8080/callback",
         *      callbackUrl: "http://localhost:8080/callback",
         *      credentials: {
         *                  merchantId: "LwKutv58548207890301",
         *                  merchantKey: "rBHSFqbQmGZJ1mu7",
         *                  }
         *  })
         * paymentInstance.InitiateTransaction({
         *      amount: "100",
         *      info: {
         *          name: "John Doe",
         *          email: "email@example.com",
         *          mobile: "1234567890",
         *          address: "123 Street, City, State, Pincode",
         *      }
         * })
        */
        public InitiateTransaction({
            amount, info, oid = Utils.generateOrderId(),
        }: InitiateTransactionProps) {
            const orderId = oid

            switch (this.config.gateway) {
                case "PAYTM":
                    PaytmSDK.setInitialParameters({
                        env: this.config.mode === "PRODUCTION" ? "PRODUCTION_ENVIRONMENT" : "STAGING_ENVIRONMENT",
                        mid: this.config.credentials.merchantId,
                        key: this.config.credentials.merchantKey,
                        website: "DEFAULT",

                    })
                    // Example using only mandatory fields
                    return PaytmSDK.createTxnTokenwithRequiredParams({
                        orderId: oid,
                        amount,
                        channelId: "WEB",
                        info
                    })

                case "BILLDESK":
                    const billDesk = new BillDesk({
                        mode: this.config.mode,
                        clientid: this.config.credentials.clientId,
                        secret_key: this.config.credentials.merchantSecret,
                        ru: this.config.callbackUrl,
                        mercid: this.config.credentials.merchantId
                    })
                    return billDesk.InitiateTransaction({
                        amount,
                        orderid: orderId,
                        info,
                    }).then((response) => response)

                case "PHONEPE":
                    const phonepe = new PhonePe({
                        mid: this.config.credentials.mid,
                        redirectUrl: this.config.redirectUrl || this.config.callbackUrl,
                        callbackUrl: this.config.callbackUrl,
                        salt_key: this.config.credentials.salt_key,
                        salt_index: this.config.credentials.salt_index
                    })
                    return phonepe.InitiateTransaction({
                        amount,
                        info,
                        orderid: orderId
                    })

                case "RAZORPAY":
                    const razorpay = new Razorpay({
                        key_id: this.config.credentials.merchantId,
                        key_secret: this.config.credentials.merchantKey,
                    })
                    return razorpay.InitiateTransaction({
                        amount: amount,
                        currency: "INR",
                        notes: info
                    })

                default:
                    Logging.dev("Gateway not found")
                    break;
            }
        }
        public Callback() { }
    }
    export class attachAdaptor {

        constructor(private adaptor: any) {
            this.adaptor = adaptor;
        }
        public InitiateTransaction() {
            return this.adaptor.InitializeTransaction();
        }

        public Callback() {
            return this.adaptor.callback();
        }
    }


}


const t = new PaymentProvider.attachAdaptor(new Paytm({
    PAYTM_MERCHANT_ID: "LwKutv58548207890301",
    PAYTM_MERCHANT_KEY: "rBHSFqbQmGZJ1mu7",
    PAYTM_ENVIRONMENT: "TEST",
    CALLBACK_URL: "http://localhost:8080/callback",
    PAYTM_MERCHANT_WEBSITE: "DEFAULT"
}))

const paymentInstance = new PaymentProvider.Factory({
    mode: "PRODUCTION",
    gateway: "PAYTM",
    callbackUrl: "http://localhost:8080/callback",
    redirectUrl: "http://localhost:8080/callback",
    credentials: {
        merchantId: "LwKutv58548207890301",
        merchantKey: "rBHSFqbQmGZJ1mu7",
    }
})

paymentInstance.InitiateTransaction({
    amount: "45454",
    info: {
        email: "dfd",
        mobile: "string",
        pincode: "string",
        firstName: "string",
        lastName: "string",
        address: "string"
    }
})