const forge = require("node-forge");
const pki = forge.pki;

const Hex = require("./Hex");

class rsasign {
  static key22 =
    "MIIBOgIBAJBALecq3BwAI4YJZwhJ+snnDFj3lF3DMqNPorV6y5ZKXCiCMqj8OeOmxk4YZW9aaV9" +
    "ckl/zlAOI0mpB3pDT+Xlj2sCAwEAAQJAW6/aVD05qbsZHMvZuS2Aa5FpNNj0BDlf38hOtkhDzz/h" +
    "kYb+EBYLLvldhgsD0OvRNy8yhz7EjaUqLCB0juIN4QIhAOeCQp+NXxfBmfdG/S+XbRUAdv8iHBl+" +
    "F6O2wr5fA2jzAiEAywlDfGIl6acnakPrmJE0IL8qvuO3FtsHBrpkUuOnXakCIQCqdr+XvADI/UTh" +
    "TuQepuErFayJMBSAsNe3NFsw0cUxAQIgGA5n7ZPfdBi3BdM4VeJWb87WrLlkVxPqeDSbcGrCyMkC" +
    "IFSs5JyXvFTreWt7IQjDssrKDRIPmALdNjvfETwlNJyY";

  /**
   * @param {string} content - 要签名的字符串内容。
   * @returns {string | null} 签名后的十六进制字符串；如果签名失败，则返回 null。
   */
  static Sign1(content) {
    return rsasign.Sign2(Buffer.from(content, "utf8"), rsasign.key22);
  }

  /**
   * @param {Buffer} content - 要签名的字节数组内容 (在 Node.js 中应为 Buffer 对象)。
   * @param {string} privateKey - 私钥的 Base64 编码字符串（ASN.1 DER 格式）。
   * @returns {string | null} 签名后的十六进制字符串；如果签名失败，则返回 null。
   */
  static Sign2(content, privateKey) {
    try {
      const keybyte = Buffer.from(privateKey.toString(), "base64");
      const asn1 = forge.asn1.fromDer(keybyte.toString("binary"));
      const rsaPrivateKey = pki.privateKeyFromAsn1(asn1);
      const md = forge.md.md5.create();
      md.update(content.toString("binary"));
      
      const signature = rsaPrivateKey.sign(md);

      return Hex.bytesToHexString(Buffer.from(signature, "binary"));
    } catch (e) {
      console.error(e);
    }
    return null;
  }
}

module.exports = rsasign;
