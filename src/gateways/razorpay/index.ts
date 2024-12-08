import rz from "razorpay";
import * as crypto from "crypto";
import { Request, Response } from "express";
import { Orders } from "razorpay/dist/types/orders";
import { RazorpayConfigurationValidator, RazorpayRequestBody } from "../../types/razorpay";
export class Razorpay {
    private razorpay: rz;
    constructor(config: RazorpayConfigurationValidator) {
        this.razorpay = new rz(config);
    }
    /**
     * Create a Razorpay order
     *
     * @param {RazorpayRequestBody} options
     * @returns {Promise<Orders.RazorpayOrder>}
     * @description
     * Creates a new order, returns the order object
     * @link https://razorpay.com/docs/api/orders/#create-an-order
     */
    async InitiateTransaction(options: RazorpayRequestBody): Promise<Orders.RazorpayOrder> {
        return this.razorpay.orders.create(options as Orders.RazorpayOrderBaseRequestBody);
    }
    VerifyPaymentStatus(req: Request, res: Response): boolean {
        if (req.query.hasOwnProperty('razorpay_order_id') && req.query.hasOwnProperty('razorpay_payment_id') && req.query.hasOwnProperty('razorpay_signature')) {
            return true;
        }
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

        const body_data = razorpay_order_id + "|" + razorpay_payment_id;

        const expect = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
            .update(body_data)
            .digest("hex");

        return expect === razorpay_signature;

    }
}