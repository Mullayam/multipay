"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.View = void 0;
var View = /** @class */ (function () {
    function View() {
    }
    View.render = function (template, data) {
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
    };
    View.BillDesk = function (data) {
        var OToken = data.OToken, bdorderid = data.bdorderid, mid = data.mid, redirect_url = data.redirect_url, base64Logo = data.base64Logo;
        var flow_config = {
            merchantId: mid,
            bdOrderId: bdorderid,
            authToken: OToken,
            childWindow: false,
            returnUrl: redirect_url,
            retryCount: 3,
        };
        var responseHandler = function (txn) {
        };
        var config = {
            merchantLogo: base64Logo,
            responseHandler: responseHandler,
            flowType: "payments",
            flowConfig: flow_config,
        };
        return "\n    <!doctype html>\n    <html>\n        <head>\n        <meta charset=\"utf-8\" />\n        <meta http-equiv=\"x-ua-compatible\" content=\"ie=edge\" />\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n        <title>Payment Page</title>\n        <link href=\"https://pay.billdesk.com/jssdk/v1/dist/billdesksdk/billdesksdk.css\"  rel=\"stylesheet\" />\n        <script src='https://pay.billdesk.com/jssdk/v1/dist/billdesksdk/billdesksdk.esm.js' async type='module'></script>\n        <script src='https://pay.billdesk.com/jssdk/v1/dist/billdesksdk.js' async noModule></script>\n        </head>\n            <body class=\"py-16 bg-gray-200\">\n            <h1 class=\"mb-4 text-4xl text-center text-gray-800 font-bold font-sans\">\n            Transaction Under Process\n            </h1>\n            <script type=\"text/javascript\"> \n            window.loadBillDeskSdk(".concat(config, ");\n            </script>\n            </body>\n    </html>");
    };
    View.PhonePe = function (data) {
        return "\n        <!doctype html>\n        <html>\n            <head>\n            <meta charset=\"utf-8\" />\n            <meta http-equiv=\"x-ua-compatible\" content=\"ie=edge\" />\n            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n            <title>Payment Page</title>\n            <script src=\"https://mercury.phonepe.com/web/bundle/checkout.js\"></script>\n            </head>\n                <body class=\"py-16 bg-gray-200\">\n                <h1 class=\"mb-4 text-4xl text-center text-gray-800 font-bold font-sans\">\n                Transaction Under Process\n                </h1>\n                <script type=\"text/javascript\"> \n               window.PhonePeCheckout.transact(".concat({ tokenUrl: data.tokenUrl }, ");\n                </script>\n                </body>\n        </html>");
    };
    View.Razorpay = function (data) {
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
        return "\n        <!doctype html>\n        <html>\n            <head>\n            <meta charset=\"utf-8\" />\n            <meta http-equiv=\"x-ua-compatible\" content=\"ie=edge\" />\n            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n            <title>Payment Page</title>\n           <script src=\"https://checkout.razorpay.com/v1/checkout.js\"></script>\n            </head>\n                <body class=\"py-16 bg-gray-200\">\n                <h1 class=\"mb-4 text-4xl text-center text-gray-800 font-bold font-sans\">\n                Transaction Under Process\n                </h1>\n                <script type=\"text/javascript\">\n                var rzp1 = new Razorpay(".concat(options, ");\n                rzp1.open();\n                </script>\n                </body>\n        </html>");
    };
    return View;
}());
exports.View = View;
