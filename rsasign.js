// rsasign.js
const forge = require('node-forge');
const pki = forge.pki;

// 注意：Base64 和 Hex 类假设您已经将它们保存在与此文件相同的目录下，
// 并且可以通过 require('./Base64') 和 require('./Hex') 访问。
// 如果您的文件结构不同，请相应调整路径。
const Base64 = require('./Base64'); // 假设 Base64 类在同级目录下
const Hex = require('./Hex');     // 假设 Hex 类在同级目录下

class rsasign {
    static key22 = "MIIBOgIBAJBALecq3BwAI4YJZwhJ+snnDFj3lF3DMqNPorV6y5ZKXCiCMqj8OeOmxk4YZW9aaV9"
            + "ckl/zlAOI0mpB3pDT+Xlj2sCAwEAAQJAW6/aVD05qbsZHMvZuS2Aa5FpNNj0BDlf38hOtkhDzz/h"
            + "kYb+EBYLLvldhgsD0OvRNy8yhz7EjaUqLCB0juIN4QIhAOeCQp+NXxfBmfdG/S+XbRUAdv8iHBl+"
            + "F6O2wr5fA2jzAiEAywlDfGIl6acnakPrmJE0IL8qvuO3FtsHBrpkUuOnXakCIQCqdr+XvADI/UTh"
            + "TuQepuErFayJMBSAsNe3NFsw0cUxAQIgGA5n7ZPfdBi3BdM4VeJWb87WrLlkVxPqeDSbcGrCyMkC"
            + "IFSs5JyXvFTreWt7IQjDssrKDRIPmALdNjvfETwlNJyY";

    /**
     * 对字符串内容进行签名。
     * Java 版本: public static String Sign1(String content)
     *
     * @param {string} content - 要签名的字符串内容。
     * @returns {string | null} 签名后的十六进制字符串；如果签名失败，则返回 null。
     */
    static Sign1(content) {
        // 在 Node.js 中，将字符串转换为 Buffer 字节数组。
        return rsasign.Sign2(Buffer.from(content, 'utf8'), rsasign.key22);
    }

    /**
     * 使用 ASN.1 格式的私钥对字节数组内容进行签名。
     * Java 版本: public static String Sign2(byte[] content, String privateKey)
     *
     * @param {Buffer} content - 要签名的字节数组内容 (在 Node.js 中应为 Buffer 对象)。
     * @param {string} privateKey - 私钥的 Base64 编码字符串（ASN.1 DER 格式）。
     * @returns {string | null} 签名后的十六进制字符串；如果签名失败，则返回 null。
     */
    static Sign2(content, privateKey) {
        try {
            // 使用 Base64 类解码私钥字符串，得到一个 Buffer。
            const keybyte = Base64.decode(privateKey.toString());

            // 将 Buffer 转换为 Forge 的 ByteBuffer。
            const asn1 = forge.asn1.fromDer(keybyte.toString('binary'));

            // 解析 PKCS#1 私钥
            // node-forge 的 pki.privateKeyFromAsn1 能够直接处理 ASN.1 结构的私钥
            const rsaPrivateKey = pki.privateKeyFromAsn1(asn1);

            // 创建 MD5WithRSA 签名对象
            const md = forge.md.md5.create();
            md.update(content.toString('binary')); // 更新哈希内容

            // 使用私钥进行签名
            const signature = rsaPrivateKey.sign(md);

            // 将签名结果（二进制字符串）转换为 Buffer，再通过 Hex 类转换为十六进制字符串
            return Hex.bytesToHexString(Buffer.from(signature, 'binary'));
        } catch (e) {
            console.error(e);
        }
        return null;
    }
}

// 如果您想在其他文件中使用这些类，可以导出它们
module.exports = rsasign