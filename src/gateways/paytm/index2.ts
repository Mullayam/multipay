/**
 * Copyright (C) 2019 Paytm.
 */
import * as Paytm from "paytm-pg-node-sdk";
import { Logging } from "../../logger";
import { UserInfoBody } from "../../types";


/**
 * This class has example of how to initialize and make api calls to hit paytm servers.
 * Here Initiate Transaction
 * Merchant will change this as per his requirements and make api calls
 */
/* class: PaytmSDK */
export class PaytmSDK {
    /**
    * @return string
    */
    private static getEChannelId(): string {
        return Paytm.EChannelId.WEB;
    }
    private static getMoney(amount: string): Paytm.Money {
        return Paytm.Money.constructWithCurrencyAndValue(Paytm.EnumCurrency.INR, amount);
    }
    /**
   * @return string
   */
    private static getOrderId(): string {
        return PaytmSDK.generateRandomString(10);
    }
    /**
   * @return UserInfo
   */
    private static getUserInfo(info: {
        address: string,
        email: string,
        firstName: string,
        lastName: string,
        mobile: string,
        pincode: string
    }): Paytm.UserInfo {
        var userInfo = new Paytm.UserInfo("cid");
        userInfo.setAddress("");
        userInfo.setPincode("");
        info.firstName && userInfo.setFirstName(info.firstName);
        info.lastName && userInfo.setLastName(info.lastName);
        info.email && userInfo.setEmail(info.email);
        info.mobile && userInfo.setMobile(info.mobile);

        return userInfo;
    }

    /**
     * @return string
     */
    private static getPaytmSsoToken(): string {
        return "SSOTokenValue"; // should be replaced with actual value of paytm sso token
    }


    /**
     * @return string
     */
    private static getCardTokenRequired(): string {
        return "TokenValue";
    }

    /**
     * @return array of PaymentMode
     */
    private static getEnablePaymentModes(): Array<object> {
        var paymentMode1 = new Paytm.PaymentMode();
        paymentMode1.setMode("CC");
        var channels1 = [Paytm.EChannelId.WEB, Paytm.EChannelId.APP];
        paymentMode1.setChannels(channels1);

        var paymentMode2 = new Paytm.PaymentMode();
        paymentMode2.setMode("CC");
        var channels2 = [Paytm.EChannelId.WEB, Paytm.EChannelId.APP];
        paymentMode2.setChannels(channels2);

        var enableMode = [paymentMode1, paymentMode2];
        return enableMode;
    }

    /**
     * @return array of PaymentMode
     */
    public static getdisablePaymentModes(): Array<object> {
        var paymentMode1 = new Paytm.PaymentMode();
        paymentMode1.setMode("CC");
        var channels1 = [Paytm.EChannelId.WEB, Paytm.EChannelId.APP];
        paymentMode1.setChannels(channels1);

        var paymentMode2 = new Paytm.PaymentMode();
        paymentMode2.setMode("CC");
        var channels2 = [Paytm.EChannelId.WEB, Paytm.EChannelId.APP];
        paymentMode2.setChannels(channels2);

        var disableMode = [paymentMode1, paymentMode2];
        return disableMode;
    }





    /**
     * @param int count
     * @return string
     */
    public static generateRandomString(count: number): string {
        var ALPHA_NUMERIC_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var charactersLength = ALPHA_NUMERIC_STRING.length;
        var rand = '';
        for (var i = 0; i < count; i++) {
            var start = Math.floor(Math.random() * charactersLength) + 1;
            rand += ALPHA_NUMERIC_STRING.substr(start, 1);
        }
        return rand;
    }

    /**
     * @return object
     */
    public static getSubWalletAmount(): object {
        var subWalletAmount: any = {};
        subWalletAmount[Paytm.UserSubWalletType.FOOD] = 1.00;
        subWalletAmount[Paytm.UserSubWalletType.GIFT] = 1.00;
        return subWalletAmount;
    }

    /**
     * @return object
     */
    public static getExtraParamsMap(): object {
        var extraParamsMap: any = {};
        extraParamsMap["data"] = "data";
        extraParamsMap["purpose"] = "merchant purpose";
        return extraParamsMap;
    }
    /**
     * Merchant can change createTxnTokenwithRequiredParams according to his need.
     *
     * This method create a PaymentDetailCopy object having all the required
     * parameters and calls SDK's initiateTransaction method to get the
     * Paytm\pg\response\InitiateTransactionResponseBody object having token which will be used in
     * future transactions such as getting payment options
     *
     * @throws Exception
     */
    public static createTxnTokenwithRequiredParams({
        orderId = PaytmSDK.getOrderId(),
        amount,
        channelId,
        info,
    }: {
        channelId: Extract<keyof typeof Paytm.EChannelId, "APP" | "WEB" | "WAP" | "SYSTEM">,
        orderId?: string
        amount: string
        info: UserInfoBody
    }): Promise<any> {
        Logging.dev("Create TxnToken with RequiredParams");
        try {



            // Transaction amount and the currency value
            var txnAmount: Paytm.Money = PaytmSDK.getMoney(amount);

            // cid : <Mandatory> user unique identification with respect to merchant

          
            var userInfo = new Paytm.UserInfo("cid");
            userInfo.setAddress("");
            userInfo.setPincode("");
           if (info) {
            info?.firstName && userInfo.setFirstName(info?.firstName);
            info?.lastName && userInfo.setLastName(info.lastName);
            info?.email && userInfo.setEmail(info.email);
            info?.mobile && userInfo.setMobile(info.mobile);            
           }
    
            /*
            * paymentDetail object will have all the information required to make
            * initiate Transaction call
            */
            var paymentDetailBuilder: Paytm.PaymentDetailBuilder = new Paytm.PaymentDetailBuilder(channelId, orderId, txnAmount, userInfo);
            var paymentDetail = paymentDetailBuilder.build();

            /*
            * Making call to SDK method which will return a Paytm\pg\response\InitiateTransactionResponseBody
            * object that will contain a token which can be used for validation purpose for
            * future transactions
            */
            return Paytm.Payment.createTxnToken(paymentDetail).then(function (response) {

                if (response instanceof Paytm.SDKResponse) {
                    response.getJsonResponse()
                }
                return response.getResponseObject()

            });
        } catch (e) {
            Logging.dev("Exception caught: " + e, "error");
            Paytm.LoggingUtil.addLog(Paytm.LoggingUtil.LogLevel.INFO, "APP", "Exception caught: ", e);
            return Promise.reject(e);
        }
    }


    /**
     * Merchant can change createTxnTokenwithPaytmSSotokenAndPaymentMode according
     * to his need.
     *
     * This method create a PaymentDetailCopy object with required parameters,
     * payment modes and PaytmSSOToken. This method calls SDK's initiateTransaction
     * method to get the Paytm\pg\response\InitiateTransactionResponseBody object having token which
     * will be used in future transactions such as getting payment options
     *
     * Merchant can only use payment modes for this transaction which he will
     * specify in this call if these payment modes are applicable on the merchant
     *
     * @throws Exception
     */
    public static createTxnTokenwithPaytmSSotokenAndPaymentMode(
        {
            orderId = PaytmSDK.getOrderId(),
            amount,
            channelId,
            info,
        }: {
            channelId: Extract<keyof typeof Paytm.EChannelId, "APP" | "WEB" | "WAP" | "SYSTEM">,
            orderId?: string
            amount: string
            info: UserInfoBody
        }
    ): Promise<any> {
        Logging.dev("Create TxnToken with Paytm SSo Token And PaymentMode");
        try {


            // Transaction amount and the currency value
            var txnAmount: Paytm.Money = PaytmSDK.getMoney(amount);

            // cid : <Mandatory> user unique identification with respect to merchant
            var userInfo = new Paytm.UserInfo("cid");
            userInfo.setAddress("");
            userInfo.setPincode("");
           if (info) {
            info?.firstName && userInfo.setFirstName(info.firstName);
            info?.lastName && userInfo.setLastName(info.lastName);
            info?.email && userInfo.setEmail(info.email);
            info?.mobile && userInfo.setMobile(info.mobile);            
           }
            // Paytm Token for a user
            var paytmSsoToken: string = PaytmSDK.getPaytmSsoToken();

            // list of the payment modes which needs to enable. If the value provided then only listed payment modes are available for transaction
            var enablePaymentMode: Array<object> = PaytmSDK.getEnablePaymentModes();

            // list of the payment modes which need to disable. If the value provided then all the listed payment modes are unavailable for transaction
            var disablePaymentMode: Array<object> = PaytmSDK.getdisablePaymentModes();

            /*
             * paymentDetail object will have all the information required to make
             * initiate Transaction call
             */
            var paymentDetailBuilder: Paytm.PaymentDetailBuilder = new Paytm.PaymentDetailBuilder(channelId, orderId, txnAmount, userInfo);
            var paymentDetail = paymentDetailBuilder
                .setPaytmSsoToken(paytmSsoToken)
                .setEnablePaymentMode(enablePaymentMode)
                .setDisablePaymentMode(disablePaymentMode)
                .build();

            /*
             * Making call to SDK method which will return a Paytm\pg\response\InitiateTransactionResponseBody
             * object that will contain a token which can be used for validation purpose for
             * future transactions
             */

            return Paytm.Payment.createTxnToken(paymentDetail).then(function (response) {

                if (response instanceof Paytm.SDKResponse) {
                    response.getJsonResponse()

                }
                return response.getResponseObject()

            });
        } catch (e) {
            Logging.dev("Exception caught: " + e, "error");
            Paytm.LoggingUtil.addLog(Paytm.LoggingUtil.LogLevel.INFO, "APP", "Exception caught: ", e);
            return Promise.reject(e);
        }
    }

    // /**
    //  * Merchant can change createTxnTokenwithAllParams according to his need.
    //  *
    //  * This method create a PaymentDetailCopy object having all the parameters and
    //  * calls SDK's initiateTransaction method to get the
    //  * Paytm\pg\response\InitiateTransactionResponseBody object having token which will be used in
    //  * future transactions such as getting payment options
    //  *
    //  * @throws Exception
    //  */
    // public static createTxnTokenwithAllParams(): Promise<any> {
    //     console.log("\n\ncreateTxnTokenwithAllParams\n");
    //     try {
    //         /*
    //          * 3. Merchants who want to use PG with Wallet, configure paymentmodes, send
    //          * Order details Subscription Information and Extended Information for accepting
    //          * payments
    //          */

    //         // Channel through which call initiated [enum (APP, WEB, WAP, SYSTEM)]
    //         var channelId: string = PaytmSDK.getEChannelId();

    //         // Unique order for each order request
    //         var orderId: string = PaytmSDK.getOrderId();

    //         // Transaction amount and the currency value
    //         var txnAmount: Paytm.Money = PaytmSDK.getMoney("10");

    //         // cid : <Mandatory> user unique identification with respect to merchant
    //         var userInfo: Paytm.UserInfo = PaytmSDK.getUserInfo({});

    //         // Paytm Token for a user
    //         var paytmSsoToken: string = PaytmSDK.getPaytmSsoToken();

    //         // list of the payment modes which needs to enable. If the value provided then only listed payment modes are available for transaction
    //         var enablePaymentMode: Array<object> = PaytmSDK.getEnablePaymentModes();

    //         // list of the payment modes which need to disable. If the value provided then all the listed payment modes are unavailable for transaction
    //         var disablePaymentMode: Array<object> = PaytmSDK.getdisablePaymentModes();

    //         // This contain the Goods info for an order.
    //         var goods: Array<object> = PaytmSDK.getGoodsInfo();


    //         // This contain the set of parameters for some additional information
    //         var extendInfo: Paytm.ExtendInfo = PaytmSDK.getExtendInfo();


    //         var cardTokenRequired: string = PaytmSDK.getCardTokenRequired();

    //         /*
    //          * paymentDetail object will have all the information required to make
    //          * initiate Transaction call
    //          */
    //         var paymentDetailBuilder: Paytm.PaymentDetailBuilder = new Paytm.PaymentDetailBuilder(channelId, orderId, txnAmount, userInfo);
    //         var paymentDetail = paymentDetailBuilder
    //             .setPaytmSsoToken(paytmSsoToken)
    //             .setEnablePaymentMode(enablePaymentMode)
    //             .setDisablePaymentMode(disablePaymentMode)
    //             .setGoods(goods)
    //             .setExtendInfo(extendInfo)
    //             .setCardTokenRequired(cardTokenRequired)
    //             .build();

    //         /*
    //          * Making call to SDK method which will return a Paytm\pg\response\InitiateTransactionResponseBody
    //          * object that will contain a token which can be used for validation purpose for
    //          * future transactions
    //          */
    //         return Paytm.Payment.createTxnToken(paymentDetail).then(function (response) {

    //             if (response instanceof Paytm.SDKResponse) {
    //                 console.log("\nRaw Response:\n", response.getJsonResponse());
    //             }

    //             // DEBUGGING INFO
    //             console.log("\nRESPONSE RECEIVED IN DEMOAPP: ", response.getResponseObject());
    //             // DEBUGGING INFO ENDS
    //         });
    //     } catch (e) {
    //         Logging.dev("Exception caught: "+ e,"error");
    //         Paytm.LoggingUtil.addLog(Paytm.LoggingUtil.LogLevel.INFO, "APP", "Exception caught: ", e);
    //         return Promise.reject(e);
    //     }
    // }


    // /**
    //  * Merchant will use getPaymentStatus after complete Paytm\pg\process\Payment. This method
    //  * (Mandatory Parameters)require OrderId ID. This will return the status for the
    //  * specific OrderId ID.
    //  *
    //  * @throws Exception
    //  */
    // public static getPaymentStatus(): Promise<any> {
    //     console.log("\n\ngetPaymentStatus\n");

    //     try {
    //         /** ..... Merchants code here .... */
    //         /** 5. Merchants who want to get TransactionStatus */

    //         /** Unique order for each order request */
    //         var orderId: string = "YOUR_ORDER_ID";
    //         var readTimeout: number = 80000;

    //         /**
    //          * Paytm\merchant\models\PaymentStatusDetail object will have all the information required to make
    //          * getPaymentStatus call
    //          */

    //         var paymentStatusDetailBuilder: Paytm.PaymentStatusDetailBuilder = new Paytm.PaymentStatusDetailBuilder(orderId);
    //         var paymentStatusDetail = paymentStatusDetailBuilder.
    //             setReadTimeout(readTimeout)
    //             .build();

    //         /**
    //          * Making call to SDK method which will return a
    //          * NativeMerchantStatusResponseBody object that will contain the Transaction
    //          * Status Paytm\pg\response\interfaces\Response regarding the Order Id
    //          */
    //         return Paytm.Payment.getPaymentStatus(paymentStatusDetail).then(function (response) {


    //             if (response instanceof Paytm.SDKResponse) {
    //                 console.log("\nRaw Response:\n", response.getJsonResponse());
    //             }

    //             // DEBUGGING INFO
    //             console.log("\nRESPONSE RECEIVED IN DEMOAPP: ", response.getResponseObject());
    //             // DEBUGGING INFO ENDS
    //         });
    //     } catch (e) {
    //         console.log("Exception caught: ", e);
    //         Paytm.LoggingUtil.addLog(Paytm.LoggingUtil.LogLevel.INFO, "DemoApp", "Exception caught: ", e);
    //         return Promise.reject(e);
    //     }
    // }

    // /**
    //  * Merchant will use doRefund after complete Paytm\pg\process\Payment. This method (Mandatory
    //  * Parameters)require Transaction ID, Transaction Type and Paytm\pg\process\Refund Amount. This
    //  * will initiate the refund for the specific Transaction ID.
    //  *
    //  * @throws Exception
    //  */
    // public static initiateRefund(): Promise<any> {
    //     console.log("\n\ninitiateRefund\n");
    //     try {
    //         /** ..... Merchants code here .... */
    //         /** 5. Merchants who want to do refund */

    //         /** Unique order for each order request */
    //         var orderId: string = "YOUR_ORDER_ID";

    //         /** REF ID returned in Paytm\pg\process\Refund call */
    //         var refId: string = "UNIQUE_REFUND_ID";

    //         /** Transaction ID returned in Paytm\pg\process\Refund Api */
    //         var txnId: string = "PAYTM_TRANSACTION_ID";

    //         /** Transaction Type returned in Paytm\pg\process\Refund Api */
    //         var txnType: string = "REFUND";

    //         /** Paytm\pg\process\Refund Amount to be refunded (should not be greater than the Amount paid in the Transaction) */
    //         var refundAmount: string = "1";
    //         var readTimeout: number = 80000;

    //         /** Subwallet amount used in Paytm\pg\process\Refund Api */
    //         var subWalletAmount: object = PaytmSDK.getSubWalletAmount();

    //         /** Extra params map used in Paytm\pg\process\Refund Api */
    //         var extraParamsMap: object = PaytmSDK.getExtraParamsMap();

    //         /** Paytm\pg\process\Refund object will have all the information required to make refund call */
    //         var refund: Paytm.RefundDetailBuilder = new Paytm.RefundDetailBuilder(orderId, refId, txnId, txnType, refundAmount);
    //         var refundDetail = refund
    //             .setReadTimeout(readTimeout)
    //             .setSubwalletAmount(subWalletAmount)
    //             .setExtraParamsMap(extraParamsMap)
    //             .build();

    //         /**
    //          * Making call to SDK method which will return a Paytm\pg\response\AsyncRefundResponseBody object
    //          * that will contain the Paytm\pg\process\Refund Paytm\pg\response\interfaces\Response regarding the Transaction Id
    //          */
    //         return Paytm.Refund.initiateRefund(refundDetail).then(function (response) {

    //             if (response instanceof Paytm.SDKResponse) {
    //                 console.log("\nRaw Response:\n", response.getJsonResponse());
    //             }

    //             // DEBUGGING INFO
    //             console.log("\nRESPONSE RECEIVED IN DEMOAPP: ", response.getResponseObject());
    //             // DEBUGGING INFO ENDS
    //         });
    //     } catch (e) {
    //         console.log("Exception caught: ", e);
    //         Paytm.LoggingUtil.addLog(Paytm.LoggingUtil.LogLevel.INFO, "DemoApp", "Exception caught: ", e);
    //         return Promise.reject(e);
    //     }
    // }

    // /**
    //  * Merchant can use getRefundStatus method to get the Status of any previous
    //  * Paytm\pg\process\Refund transaction.
    //  *
    //  * Merchant will use getRefundStatus after Paytm\pg\process\Payment. This method (Mandatory
    //  * Parameters)require OrderId ID and refId. This will return the
    //  * Paytm\merchant\models\SDKResponse object having status for the
    //  * specific Paytm\pg\process\Refund.
    //  *
    //  * @throws Exception
    //  */
    // public static getRefundStatus(): Promise<any> {

    //     console.log("\n\ngetRefundStatus\n");
    //     try {
    //         /** ..... Merchants code here .... */
    //         /** 4. Merchants who want to get Paytm\pg\process\Refund Status */

    //         /** Unique order for each order request */
    //         var orderId: string = "YOUR_ORDER_ID";

    //         /** Unique ref id for each refund request */
    //         var refId: string = "YOUR_REFUND_ID";

    //         var readTimeout: number = 8000;

    //         /**
    //          * Paytm\merchant\models\RefundStatusDetail object will have all the information required to make
    //          * getRefundStatus call
    //          */
    //         var refundStatusDetailBuilder: Paytm.RefundStatusDetailBuilder = new Paytm.RefundStatusDetailBuilder(orderId, refId);
    //         var refundStatusDetail = refundStatusDetailBuilder
    //             .setReadTimeout(readTimeout)
    //             .build();

    //         // Following 2 lines are only for testing purpose
    //         Paytm.MerchantProperties.setMid("YOUR_MID_HERE");
    //         Paytm.MerchantProperties.setMerchantKey("YOUR_KEY_HERE");

    //         /**
    //          * Making call to SDK method which will return the
    //          * Paytm\merchant\models\SDKResponse(Paytm\pg\request\NativeRefundStatusRequest) that holds Paytm\pg\process\Refund Status of any
    //          * previous Paytm\pg\process\Refund.
    //          */
    //         return Paytm.Refund.getRefundStatus(refundStatusDetail).then(function (response) {

    //             if (response instanceof Paytm.SDKResponse) {
    //                 console.log("\nRaw Response:\n", response.getJsonResponse());
    //             }

    //             // DEBUGGING INFO
    //             console.log("\nRESPONSE RECEIVED IN DEMOAPP: ", response.getResponseObject());
    //             // DEBUGGING INFO ENDS
    //         });
    //     } catch (e) {
    //         console.log("Exception caught: ", e);
    //         Paytm.LoggingUtil.addLog(Paytm.LoggingUtil.LogLevel.INFO, "DemoApp", "Exception caught: ", e);
    //         return Promise.reject(e);
    //     }
    // }

    /**
     * @return void
     * @throws Exception
     */
    public static setInitialParameters({
        env,
        mid,
        key,
        website
    }: {
        env: Extract<keyof typeof Paytm.LibraryConstants, "PRODUCTION_ENVIRONMENT" | "STAGING_ENVIRONMENT">,
        mid: string,
        key: string,
        website: string
    }): void {
        try {
            /** Initialize mandatory Parameters */
            Paytm.MerchantProperties.initialize(env, mid, key, website);
            /** Setting timeout for connection i.e. Connection Timeout */
            Paytm.MerchantProperties.setConnectionTimeout(5000);
        } catch (e) {
            console.log("Exception caught: ", e);
            Paytm.LoggingUtil.addLog(Paytm.LoggingUtil.LogLevel.INFO, website, "Exception caught: ", e);
        }
    }
}
