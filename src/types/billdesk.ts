export interface BillDeskConfigurationValidator {
    mercid: string
    ru: string
    clientid: string
    secret_key: string
    mode: "PRODUCTION" | "SANDBOX"

}
export interface BillDeskInitiateTransaction {
    orderid: string
    amount: string
    info?: Record<string, string>
    ip?: string
    ua?: string
}
export interface BillDeskIniTxnResponse {
    objectid: string
    orderid: string
    bdorderid: string
    mercid: string
    order_date: string
    amount: string
    currency: string
    ru: string
    additional_info: AdditionalInfo
    itemcode: string
    createdon: string
    next_step: string
    links: Link[]
    status: string
}

export interface AdditionalInfo {
    additional_info1: string
    additional_info2: string
    additional_info3: string
    additional_info4: string
    additional_info5: string
    additional_info6: string
    additional_info7: string
    additional_info8: string
    additional_info9: string
    additional_info10: string
}

export interface Link {
    href: string
    rel: string
    method: string
    parameters?: Parameters
    valid_date?: string
    headers?: Headers
}

export interface Parameters {
    mercid: string
    bdorderid: string
    rdata: string
}

export interface Headers {
    authorization: string
}

export interface TransactionResponsePayload {
    mercid: string
    transaction_date: string
    surcharge: string
    payment_method_type: string
    amount: string
    ru: string
    orderid: string
    transaction_error_type: string
    discount: string
    payment_category: string
    bank_ref_no: string
    transactionid: string
    txn_process_type: string
    bankid: string
    itemcode: string
    transaction_error_code: string
    currency: string
    auth_status: string
    transaction_error_desc: string
    objectid: string
    charge_amount: string
}
