import * as crypto from "crypto"
import moment from 'moment-timezone';
import { ORDER_ID } from "../types";

export class Utils {
   
    static generateTransactionId() {
        const timeStamp = Date.now();
        const randomNumber = Math.floor(Math.random() * 100000);
        const merchantPrefix = 'TXN';
        const transactionId = `${merchantPrefix}${timeStamp}${randomNumber}`
        return transactionId;
    }
     static generateOrderId(): ORDER_ID {
      const date = new Date();
      
      // Get formatted date and time
      const year = date.getFullYear().toString().slice(2); // last 2 digits of the year
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // months are 0-based
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
    
      // Generate a random 6-digit number
      const randomNum = Math.floor(100000 + Math.random() * 900000); // ensures it's always 6 digits
      
      // Construct the order ID
      const orderId = `order_${year}${month}${day}${hours}${minutes}${seconds}${randomNum}`;
    
      return orderId as ORDER_ID;
    }
    static async sha256(checksum:string) {
        const encoder = new TextEncoder();
        const data = encoder.encode(checksum);

        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
    static slugify(str:string) {
        return String(str)
          .normalize('NFKD') // split accented characters into their base characters and diacritical marks
          .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
          .trim() // trim leading or trailing whitespace
          .toLowerCase() // convert to lowercase
          .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
          .replace(/\s+/g, '-') // replace spaces with hyphens
          .replace(/-+/g, '-'); // remove consecutive hyphens
      }
      static base64UrlEncode(data:any):string {
        const buffer = Buffer.from(JSON.stringify(data));
        return buffer
          .toString("base64")
          .replace(/=/g, "")
          .replace(/\+/g, "-")
          .replace(/\//g, "_");
      }
     static createDateTime() {
        const now = moment().tz("Asia/Kolkata");
        const year = now.format("YYYY");
        const month = this.formatWithLeadingZeros(now.format("MM"), 2);
        const day = this.formatWithLeadingZeros(now.format("DD"), 2);
        const hours = this.formatWithLeadingZeros(now.format("HH"), 2);
        const minutes = this.formatWithLeadingZeros(now.format("mm"), 2);
        const seconds = this.formatWithLeadingZeros(now.format("ss"), 2);
    
        return `${year}${month}${day}${hours}${minutes}${seconds}`;
      }
      static formatWithLeadingZeros(num: string|number, length:number):string {
        return num.toString().padStart(length, "0");
      }
}
