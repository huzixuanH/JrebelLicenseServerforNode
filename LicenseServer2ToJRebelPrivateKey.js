const crypto = require("crypto");
const ByteUtil = require("./ByteUtil.js");

class LicenseServer2ToJRebelPrivateKey {
  static c; // 在 Node.js 中，这将是一个 Buffer
  static d;

  static {
    const base64Pkcs8Key =
      "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAND3cI/pKMSd4OLMIXU/8xoEZ/nza+g00Vy7ygyGB1Nn83qpro7tckOvUVILJoN0pKw8J3E8rtjhSyr9849qzaQKBhxFL+J5uu08QVn/tMt+Tf0cu5MSPOjT8I2+NWyBZ6H0FjOcVrEUMvHt8sqoJDrDU4pJyex2rCOlpfBeqK6XAgMBAAECgYBM5C+8FIxWxM1CRuCs1yop0aM82vBC0mSTXdo7/3lknGSAJz2/A+o+s50Vtlqmll4drkjJJw4jacsR974OcLtXzQrZ0G1ohCM55lC3kehNEbgQdBpagOHbsFa4miKnlYys537Wp+Q61mhGM1weXzosgCH/7e/FjJ5uS6DhQc0Y+QJBAP43hlSSEo1BbuanFfp55yK2Y503ti3Rgf1SbE+JbUvIIRsvB24xHa1/IZ+ttkAuIbOUomLN7fyyEYLWphIy9kUCQQDSbqmxZaJNRa1o4ozGRORxR2KBqVn3EVISXqNcUH3gAP52U9LcnmA3NMSZs8tzXhUhYkWQ75Q6umXvvDm4XZ0rAkBoymyWGeyJy8oyS/fUW0G63mIroZZ4Rp+F098P3j9ueJ2k/frbImXwabJrhwjUZe/Afel+PxL2ElUDkQW+BMHdAkEAk/U7W4Aanjpfs1+Xm9DUztFicciheRa0njXspvvxhY8tXAWUPYseG7L+iRPh+Twtn0t5nm7VynVFN0shSoCIAQJALjo7A6bzsvfnJpV+lQiOqD/WCw3A2yPwe+1d0X/13fQkgzcbB3K0K81Euo/fkKKiBv0A7yR7wvrNjzefE9sKUw==";
    LicenseServer2ToJRebelPrivateKey.c = ByteUtil.a2(base64Pkcs8Key);

    LicenseServer2ToJRebelPrivateKey.d = {
      _isBouncyCastleProviderPlaceholder: true,
      name: "BouncyCastleProvider(NodeJsPlaceholder)",
    };
  }

  /**
   * 加载私钥。
   * @returns {crypto.KeyObject | null} Node.js 中的私钥对象，如果失败则返回 null。
   */
  static a1() {
    const pkcs8KeyBuffer = LicenseServer2ToJRebelPrivateKey.c;

    try {
      const privateKey = crypto.createPrivateKey({
        key: pkcs8KeyBuffer,
        format: "der", // 'der' 指示 key 是二进制 DER 格式
        type: "pkcs8", // 指示 key 的类型是 PKCS#8
      });
      return privateKey;
    } catch (ex) {
      console.error("Error in a1() while creating private key:", ex);
      return null;
    }
  }

  /**
   * 使用 SHA1withRSA 算法对给定的字节数组进行签名。
   * @param {Buffer} array - 需要签名的字节数组 (Node.js 中的 Buffer)。
   * @returns {Buffer} 签名后的字节数组 (Node.js 中的 Buffer)。
   * @throws {Error} 如果签名过程中发生错误，或者私钥加载失败。
   */
  static a2(array) {
    try {
      const algorithm = "RSA-SHA1"; // Node.js "RSA-SHA1"
      const sign = crypto.createSign(algorithm);

      // 在 Node.js crypto 中，私钥在调用 sign.sign() 时提供。
      const privateKey = LicenseServer2ToJRebelPrivateKey.a1();

      if (!privateKey) {
        // 如果 a1() 返回 null (加载私钥失败)，则抛出错误。
        throw new Error("Failed to load private key from a1() for signing.");
      }

      sign.update(array);

      return sign.sign(privateKey);
    } catch (ex) {
      const errorMessage = "License Server installation error 0000000F2";
      throw new Error(errorMessage, { cause: ex });
    }
  }
}

module.exports = LicenseServer2ToJRebelPrivateKey;
