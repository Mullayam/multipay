import { Orders } from "razorpay/dist/types/orders";
import { PaymentModes } from "../../types";


export class View {

    public static render(template: PaymentModes, data: any) {
        switch (template) {
            case "BILLDESK":
                return View.BillDesk(data);
            case "PHONEPE":
                return View.PhonePe(data);
            case "RAZORPAY":
                return View.Razorpay(data);

            default:
                break;
        }

    }
    private static BillDesk(data: {
        OToken: string,
        bdorderid: string,
        mid: string,
        redirect_url: string,
        base64Logo: string
    }) {
        const { OToken,
            bdorderid,
            mid,
            redirect_url, base64Logo } = data;
        const flow_config = {
            merchantId: mid,
            bdOrderId: bdorderid,
            authToken: OToken,
            childWindow: false,
            returnUrl: redirect_url,
            retryCount: 3,
        };
        const responseHandler = function (txn: any) {

        };
        const config = {
            merchantLogo: base64Logo,
            responseHandler: responseHandler,
            flowType: "payments",
            flowConfig: flow_config,
        };
        return `
    <!doctype html>
    <html>
        <head>
        <meta charset="utf-8" />
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Payment Page</title>
        <link href="https://pay.billdesk.com/jssdk/v1/dist/billdesksdk/billdesksdk.css"  rel="stylesheet" />
        <script src='https://pay.billdesk.com/jssdk/v1/dist/billdesksdk/billdesksdk.esm.js' async type='module'></script>
        <script src='https://pay.billdesk.com/jssdk/v1/dist/billdesksdk.js' async noModule></script>
        </head>
            <body class="py-16 bg-gray-200">
            <h1 class="mb-4 text-4xl text-center text-gray-800 font-bold font-sans">
            Transaction Under Process
            </h1>
            <script type="text/javascript"> 
            window.loadBillDeskSdk(${config});
            </script>
            </body>
    </html>`
    }
    private static PhonePe(data: { tokenUrl: string }) {

        return `
        <!doctype html>
        <html>
            <head>
            <meta charset="utf-8" />
            <meta http-equiv="x-ua-compatible" content="ie=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Payment Page</title>
            <script src="https://mercury.phonepe.com/web/bundle/checkout.js"></script>
            </head>
                <body class="py-16 bg-gray-200">
                <h1 class="mb-4 text-4xl text-center text-gray-800 font-bold font-sans">
                Transaction Under Process
                </h1>
                <script type="text/javascript"> 
               window.PhonePeCheckout.transact(${{ tokenUrl: data.tokenUrl }});
                </script>
                </body>
        </html>`
    }
    private static Razorpay(data: { key_id: string, callback_url: string, name: string } & Orders.RazorpayOrder) {

        var options = {

            "key": data.key_id, // Enter the Key ID generated from the Dashboard
            "amount": data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": data.currency,
            "name": data.name,
            "description": data.description,
            "image": "https://example.com/your_logo",
            "order_id": data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "callback_url": data.callback_url,           
            "notes": data.notes,
            "theme": {
                "color": "#3399cc"
            }
        };
        return `
        <!doctype html>
        <html>
            <head>
            <meta charset="utf-8" />
            <meta http-equiv="x-ua-compatible" content="ie=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Payment Page</title>
           <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
            </head>
                <body class="py-16 bg-gray-200">
                <h1 class="mb-4 text-4xl text-center text-gray-800 font-bold font-sans">
                Transaction Under Process
                </h1>
                <script type="text/javascript">
                var rzp1 = new Razorpay(${options});
                rzp1.open();
                </script>
                </body>
        </html>`
    }
}