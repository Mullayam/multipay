"use strict";

import * as crypto from "crypto";

const iv = "@@@@&&&&####$$$$";
export default class PaytmChecksum {
  static encrypt(input: any, key: string) {
    const cipher = crypto.createCipheriv("AES-128-CBC", key, iv);
    let encrypted = cipher.update(input, "binary", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
  }
  static decrypt(encrypted: any, key: string) {
    const decipher = crypto.createDecipheriv("AES-128-CBC", key, iv);
    let decrypted = decipher.update(encrypted, "base64", "binary");
    try {
      decrypted += decipher.final("binary");
    } catch (e) {
    }
    return decrypted;
  }
  static async generateSignature(params: any, key: string) {
    if (typeof params !== "object" && typeof params !== "string") {
      var error = "string or object expected, " + typeof params + " given.";
      return Promise.reject(error);
    }
    if (typeof params !== "string") {
      params = PaytmChecksum.getStringByParams(params);
    }

    return await PaytmChecksum.generateSignatureByString(params, key);
  }

  static verifySignature(params: any, key: string, checksum: string) {
    if (typeof params !== "object" && typeof params !== "string") {
      var error = "string or object expected, " + typeof params + " given.";
      return Promise.reject(error);
    }
    if (params.hasOwnProperty("CHECKSUMHASH")) {
      delete params.CHECKSUMHASH;
    }
    if (typeof params !== "string") {
      params = PaytmChecksum.getStringByParams(params);
    }
    return PaytmChecksum.verifySignatureByString(params, key, checksum);
  }

  static async generateSignatureByString(params: string, key: string) {

    var salt = (await PaytmChecksum.generateRandomString(4)) as string;
   
    return PaytmChecksum.calculateChecksum(params, key, salt);
  }

  static verifySignatureByString(params: any, key: string, checksum: string) {
    var paytm_hash = PaytmChecksum.decrypt(checksum, key);
    var salt = paytm_hash.substr(paytm_hash.length - 4);
    return paytm_hash === PaytmChecksum.calculateHash(params, salt);
  }

  static generateRandomString(length: number) {
    return new Promise(function (resolve, reject) {
      crypto.randomBytes((length * 3.0) / 4.0, function (err: any, buf: any) {
        if (!err) {
          var salt = buf.toString("base64");
          resolve(salt);
        } else {
          console.log("error occurred in generateRandomString: " + err);
          reject(err);
        }
      });
    });
  }

  static getStringByParams(params: any) {
    var data: any = {};
    Object.keys(params)
      .sort()
      .forEach(function (key) {
        data[key] =
          params[key] !== null && params[key].toLowerCase() !== "null"
            ? params[key]
            : "";
      });
    return Object.values(data).join("|");
  }

  static calculateHash(params: any, salt: string) {
    const finalString = params + "|" + salt;

    return crypto.createHash("sha256").update(finalString).digest("hex") + salt;
  }
  static calculateChecksum(params: string, key: string, salt: string) {
    
    const hashString = PaytmChecksum.calculateHash(params, salt);
     
    return PaytmChecksum.encrypt(hashString, key);
  }
}