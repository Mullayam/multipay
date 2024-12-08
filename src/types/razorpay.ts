import { RazorpayHeaders } from "razorpay/dist/types/api";
import { Orders } from "razorpay/dist/types/orders";

export interface RazorpayConfigurationValidator {
    key_id: string;
    key_secret: string;
    headers?: RazorpayHeaders;
}

export type RazorpayRequestBody = {
    amount: Number,
    currency: "INR",
} | Orders.RazorpayOrderCreateRequestBody | Orders.RazorpayTransferCreateRequestBody | Orders.RazorpayAuthorizationCreateRequestBody