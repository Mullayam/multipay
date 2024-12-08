import { PaytmConfigurationValidator } from './paytm';
import { PhonePeConfigurationValidator } from './phonepe';
import { RazorpayConfigurationValidator } from './razorpay';
import { BillDeskConfigurationValidator } from './billdesk';
export type ClassConstructor<T = any> = new (...args: any[]) => T;
export type PaymentModes = "PAYTM" | "PHONEPE" | "RAZORPAY" | "BILLDESK"
interface PaymentProvider {
    initiateTransaction: () => Promise<any>;
    callback: () => Promise<any>;
}
type OID =
    `order_${string | number}` |
    `oid_${string | number}` |
    `ORDER_${string | number}` |
    `OID_${string | number}`;
export type ORDER_ID = OID

export interface InitiateTransactionProps {
    amount: string
    info: UserInfoBody
    oid?: ORDER_ID
}
interface PaymentOptionsMap {
    PAYTM: PaytmConfigurationValidator
    PHONEPE: PhonePeConfigurationValidator
    RAZORPAY: RazorpayConfigurationValidator
    BILLDESK: BillDeskConfigurationValidator
}
export type UserInfoBody = {
    email: string
    mobile: string
    address?: string
    firstName?: string
    lastName?: string
    pincode?: string
}
export type DefaultConfig = {
    mode: "SANDBOX" | "PRODUCTION"
    preferences?: PaymentModes[]
    callbackUrl: string
    redirectUrl: string
} & PaymentGatewayConfig

export type Config = {
    mode: "SANDBOX" | "PRODUCTION"
    callbackUrl: string
    redirectUrl?: string
} & PaymentGatewayConfig2
type PaymentGatewayConfig = {
    gateway: "PAYTM"
    options: PaytmConfigurationValidator
} | {
    gateway: "PHONEPE"
    options: PhonePeConfigurationValidator
} | {
    gateway: "RAZORPAY";
    options: RazorpayConfigurationValidator;
}
    | {
        gateway: "BILLDESK";
        options: BillDeskConfigurationValidator
    };
type PaymentGatewayConfig2 = {
    gateway: "PAYTM"
    credentials: PaytmCredentials
} | {
    gateway: "PHONEPE"
    credentials: PhonePeCredentials
} | {
    gateway: "RAZORPAY";
    credentials: RazorpayCredentials;
}
    | {
        gateway: "BILLDESK";
        credentials: BillDeskCredentials
    };
interface PaytmCredentials {
    merchantId: string
    merchantKey: string
}
type PhonePeCredentials = {
    mid: string
    salt_key: string
    salt_index?: string | 1
}
type RazorpayCredentials = {
    merchantId: string
    merchantKey: string
}
type BillDeskCredentials = {
    merchantId: string
    clientId: string
    merchantSecret: string
}

