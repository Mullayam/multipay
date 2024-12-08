import {  Request, Response } from "express";
export interface StringValidator {
  InitializeTransaction(req: Request, res: Response): void;
  VerifyPaymentStatus(req: Request, res: Response): void;
}

export interface CallBack {
  redirect: boolean;
  onSuccess?: string | "/";
  onFailure?: string | "/";
}
type PAYTM_MERCHANT_WEBSITE = "DEFAULT" | "WEBSTAGING";
export interface PaytmConfigurationValidator {
  PAYTM_ENVIRONMENT: "TEST" | "LIVE";
  PAYTM_MERCHANT_ID: string;
  PAYTM_MERCHANT_KEY: string;
  PAYTM_MERCHANT_WEBSITE: PAYTM_MERCHANT_WEBSITE;
  CALLBACK_URL: string;
  PAYTM_CHANNEL?: "WEB";
  PAYTM_INDUSTRY_TYPE?: "Retail" | string;
}
export interface UserInfoType {
  custId: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  address: string;
  pincode?: string;
  displayName?: string;
}
export interface ResultInfoType {
  resultCode: string;
  resultStatus: string;
  resultMsg?: string;
  isRedirect?: boolean;
  bankRetry?: boolean;
  retry?: boolean;
}
export interface PaymentDetailType {
  channelId: string;
  orderId: string;
  txnAmount: Money;
  userInfo: UserInfoType;
}
export interface Money {
  currency?: "INR";
  value?: number|string;
}
 
export interface InitiateTransactionResponse {
  head: SecureResponseHeader;
  body: InitiateTransactionResponseBody;
}
export interface InitiateTransactionRequestBody {
  requestType: string;
  mid: string;
  websiteName: string;
  orderId: string;
  callbackUrl: string;
  txnAmount: Money;
  userInfo: UserInfoType;
}
export interface SecureResponseHeader {
  clientId?: string;
  channelId?: string;
  signature: string;
  responseTimestamp: string;
  version: string;
}
export interface InitiateTransactionResponseBody {
  resultInfo: ResultInfoType;
  txnInfo?: ResponseTransactionInfo;
  txnToken?: string;
  isPromoCodeValid?: boolean;
  extraParamsMap?: object;
  callBackUrl?: boolean;
}
export interface ResponseTransactionInfo {
  MID: string;
  TXNID: string;
  ORDERID: string;
  BANKTXNID: string;
  TXNAMOUNT: string;
  CURRENCY: string;
  STATUS: PaymentStatus;
  RESPCODE: string;
  RESPMSG: string;
  TXNDATE: string;
  GATEWAYNAME?: string;
  PAYMENTMODE?: string;
  CHECKSUMHASH: string;
  VPA?: string;
}
enum PaymentStatus {
  "TXN_SUCCESS",
  "TXN_FAILURE",
  "PENDING",
}
type SetParams =
  | "MID"
  | "ORDER_ID"   
   

export type Params = {
  [key in SetParams]: string;
} 
export interface RequestBodyParams {
  amount: string;
  custId: string;
  orderId: string;
  email: string;
  phone: string;
}

export interface PaytmParamsBody {
  orderId: string;
}
export type VerifyPaymentStatusParamsType = {
  body?: any;
  head?: any;
};
type ResponseBodyResultInfo = {
  resultStatus: string;
  resultCode: string;
  resultMsg: string;
};
export type ResponseBody = {
  body: {
    resultInfo: ResponseBodyResultInfo;
    txnId?: string;
    bankTxnId?: string;
    orderId?: string;
    txnAmount?: string;
    txnType?: string;
    gatewayName?: string;
    bankName?: string;
    mid?: string;
    paymentMode?: string;
    refundAmt?: string;
    txnDate?: string;
    authRefId?: string;
  };
};

 
export type userInfo = {
  custId: any
  email: string
}
export type Data = {
  name: string
}
export type BodyType = {
  requestType: string
  mid: string
  websiteName: string
  orderId: string
  callbackUrl: string
  txnAmount: Money
  userInfo: userInfo
}
export type PaytmParamsBodyServerLess = {
  body?: BodyType
  head?: any
}
export type ResponseType = {
  data?: any
}