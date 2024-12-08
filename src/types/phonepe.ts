export interface PhonePeConfigurationValidator {
    mid: string    
    salt_key: string  
    salt_index?: string | 1
    redirectUrl: string
    callbackUrl: string
}
export interface PhonePeInitiateTransaction {
    orderid:string,
    amount:string,
    info:{
        mobile:string
    }
}

export interface InitiateTransactionRequestBody {
    amount: number
    merchantId: string
    merchantTransactionId: string
    callbackUrl: string
    paymentMode: string
}
export interface WebhookResponse {
    success: boolean
    code: string
    message: string
    data: PaymentDataMessage
}

export interface PaymentDataMessage {
    merchantId: string
    merchantTransactionId: string
    transactionId: string
    amount: number
    state: string
    responseCode: string
    paymentInstrument: PaymentInstrument
}

export interface PaymentInstrument {
    type: string
    pgTransactionId: string
    pgServiceTransactionId: string
    bankTransactionId: any
    bankId: string
}

