// LicenseServer2ToJRebelPrivateKey.js

// 引入 Node.js 内置的 crypto 模块用于加密操作
const crypto = require('crypto');
// 引入本地的 ByteUtil 模块 (假设与此文件在同级目录)
// ByteUtil.js 应该导出一个包含静态方法 a2 的类 ByteUtil
const ByteUtil = require('./ByteUtil.js');

// Java: import org.bouncycastle.jce.provider.BouncyCastleProvider;
// 在 Node.js 中，我们通常使用内置的 crypto 模块。
// BouncyCastleProvider 在 Java 中用于指定加密服务提供者。
// 在 Node.js 的 crypto 模块中，算法通常通过字符串指定，不需要显式的 provider 对象。
// 但为了保持变量 d 的存在（根据要求“不要擅自加减方法和变量”），我们会声明并初始化它。

class LicenseServer2ToJRebelPrivateKey {
    // private static final byte[] c;
    // 对应 Java 中的 c，存储私钥的字节形式 (DER编码的PKCS#8)
    static c; // 在 Node.js 中，这将是一个 Buffer

    // private static final BouncyCastleProvider d;
    // 对应 Java 中的 d。在 Node.js 中，我们将它初始化为一个占位对象。
    static d;

    // 静态初始化块
    static {
        // Java: c = ByteUtil.a2("MIICXAIBAAKB...");
        // 这个非常长的字符串是 Base64 编码的 PKCS#8 私钥。
        // ByteUtil.a2 方法将其解码为字节数组 (Node.js 中的 Buffer)。
        const base64Pkcs8Key = "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAND3cI/pKMSd4OLMIXU/8xoEZ/nza+g00Vy7ygyGB1Nn83qpro7tckOvUVILJoN0pKw8J3E8rtjhSyr9849qzaQKBhxFL+J5uu08QVn/tMt+Tf0cu5MSPOjT8I2+NWyBZ6H0FjOcVrEUMvHt8sqoJDrDU4pJyex2rCOlpfBeqK6XAgMBAAECgYBM5C+8FIxWxM1CRuCs1yop0aM82vBC0mSTXdo7/3lknGSAJz2/A+o+s50Vtlqmll4drkjJJw4jacsR974OcLtXzQrZ0G1ohCM55lC3kehNEbgQdBpagOHbsFa4miKnlYys537Wp+Q61mhGM1weXzosgCH/7e/FjJ5uS6DhQc0Y+QJBAP43hlSSEo1BbuanFfp55yK2Y503ti3Rgf1SbE+JbUvIIRsvB24xHa1/IZ+ttkAuIbOUomLN7fyyEYLWphIy9kUCQQDSbqmxZaJNRa1o4ozGRORxR2KBqVn3EVISXqNcUH3gAP52U9LcnmA3NMSZs8tzXhUhYkWQ75Q6umXvvDm4XZ0rAkBoymyWGeyJy8oyS/fUW0G63mIroZZ4Rp+F098P3j9ueJ2k/frbImXwabJrhwjUZe/Afel+PxL2ElUDkQW+BMHdAkEAk/U7W4Aanjpfs1+Xm9DUztFicciheRa0njXspvvxhY8tXAWUPYseG7L+iRPh+Twtn0t5nm7VynVFN0shSoCIAQJALjo7A6bzsvfnJpV+lQiOqD/WCw3A2yPwe+1d0X/13fQkgzcbB3K0K81Euo/fkKKiBv0A7yR7wvrNjzefE9sKUw=="
        LicenseServer2ToJRebelPrivateKey.c = ByteUtil.a2(base64Pkcs8Key);

        // Java: d = new BouncyCastleProvider();
        // 在 Node.js 中，crypto 操作不直接使用此类 provider 实例。
        // 我们将 d 初始化为一个简单对象，以表示其存在并符合不增删变量的要求。
        LicenseServer2ToJRebelPrivateKey.d = {
            _isBouncyCastleProviderPlaceholder: true,
            name: "BouncyCastleProvider(NodeJsPlaceholder)"
        };
    }

    /**
     * 加载私钥。
     * Java: private static PrivateKey a1()
     * @returns {crypto.KeyObject | null} Node.js 中的私钥对象，如果失败则返回 null。
     */
    static a1() {
        // Java: final PKCS8EncodedKeySpec pkcs8EncodedKeySpec = new PKCS8EncodedKeySpec(LicenseServer2ToJRebelPrivateKey.c);
        // LicenseServer2ToJRebelPrivateKey.c 已经是 Buffer 形式的 DER 编码的 PKCS#8 私钥数据。
        const pkcs8KeyBuffer = LicenseServer2ToJRebelPrivateKey.c;

        try {
            // Java: KeyFactory.getInstance("RSA", LicenseServer2ToJRebelPrivateKey.d).generatePrivate(pkcs8EncodedKeySpec);
            // Node.js 使用 crypto.createPrivateKey 从 PKCS#8 数据创建私钥对象。
            // 'RSA' 类型会从 PKCS#8 数据中自动推断。
            // provider 'd' 在 Node.js crypto 中不这样使用。
            const privateKey = crypto.createPrivateKey({
                key: pkcs8KeyBuffer,
                format: 'der', // 'der' 指示 key 是二进制 DER 格式
                type: 'pkcs8'  // 指示 key 的类型是 PKCS#8
            });
            return privateKey;
        } catch (ex) {
            // Java: ex.printStackTrace();
            console.error("Error in a1() while creating private key:", ex);
            return null;
        }
    }

    /**
     * 使用 SHA1withRSA 算法对给定的字节数组进行签名。
     * Java: public static byte[] a2(final byte[] array)
     * @param {Buffer} array - 需要签名的字节数组 (Node.js 中的 Buffer)。
     * @returns {Buffer} 签名后的字节数组 (Node.js 中的 Buffer)。
     * @throws {Error} 如果签名过程中发生错误，或者私钥加载失败。
     */
    static a2(array) {
        try {
            // Java: final Signature instance = Signature.getInstance("SHA1withRSA", LicenseServer2ToJRebelPrivateKey.d);
            // Node.js 中对应的签名算法字符串通常是 'RSA-SHA1'。
            // provider 'd' 在 Node.js crypto 中不这样使用。
            const algorithm = 'RSA-SHA1'; // Java "SHA1withRSA" 对应 Node.js "RSA-SHA1"
            const sign = crypto.createSign(algorithm);

            // Java: instance.initSign(a1());
            // 在 Node.js crypto 中，私钥在调用 sign.sign() 时提供。
            const privateKey = LicenseServer2ToJRebelPrivateKey.a1();

            if (!privateKey) {
                // 如果 a1() 返回 null (加载私钥失败)，则抛出错误。
                throw new Error("Failed to load private key from a1() for signing.");
            }

            // Java: instance.update(array);
            sign.update(array);

            // Java: return instance.sign();
            // Node.js: sign.sign(privateKey) 返回签名，结果是一个 Buffer。
            return sign.sign(privateKey);

        } catch (ex) { // 捕获 crypto 操作的错误或上面 privateKey 加载失败的错误
            // Java: throw new RuntimeException("License Server installation error 0000000F2", ex);
            // 创建一个新的 Error 对象，并将原始异常作为原因（如果 Node.js 版本支持 cause 属性）。
            // Node.js v16.9.0+ 支持 error cause。
            const errorMessage = "License Server installation error 0000000F2";
            // 为了更广泛的兼容性，可以简单地将原始错误信息附加到新错误信息中。
            // throw new Error(`${errorMessage}: ${ex.message}`);
            // 或者使用 cause 属性 (推荐用于现代 Node.js):
            throw new Error(errorMessage, { cause: ex });
        }
    }
}

// 如果您想在 Node.js 项目中将这个类作为一个模块使用，可以导出它：
module.exports = LicenseServer2ToJRebelPrivateKey;

// ----- 可选的测试代码 -----
/*
async function runLicenseServerTests() {
    console.log("测试 LicenseServer2ToJRebelPrivateKey 功能:");

    // 检查静态变量 c 和 d 是否按预期初始化
    if (LicenseServer2ToJRebelPrivateKey.c && LicenseServer2ToJRebelPrivateKey.c.length > 0) {
        console.log("静态变量 'c' (私钥Buffer) 初始化成功，长度:", LicenseServer2ToJRebelPrivateKey.c.length);
    } else {
        console.error("静态变量 'c' 初始化失败或为空。");
        return; // 如果 c 未初始化，后续测试无法进行
    }
    console.log("静态变量 'd' (BouncyCastleProvider占位符):", LicenseServer2ToJRebelPrivateKey.d);

    // 测试 a1(): 加载私钥
    let privateKey;
    try {
        privateKey = LicenseServer2ToJRebelPrivateKey.a1();
        if (privateKey) {
            console.log("a1(): 私钥加载成功。类型:", typeof privateKey, privateKey.type);
        } else {
            console.error("a1(): 私钥加载失败，返回 null。");
            return; // 如果私钥加载失败，后续签名测试无法进行
        }
    } catch (e) {
        console.error("a1(): 调用时发生异常:", e);
        return;
    }

    // 测试 a2(): 数据签名
    const dataToSign = Buffer.from("This is some data to sign for JRebel license test.", "utf8");
    try {
        const signature = LicenseServer2ToJRebelPrivateKey.a2(dataToSign);
        if (signature && signature.length > 0) {
            console.log("a2(): 数据签名成功。签名长度:", signature.length);
            console.log("签名 (Hex):", signature.toString('hex'));

            // 可选：验证签名 (需要公钥，公钥未在此类中提供，所以这里只是示意)
            // 要验证签名，您需要从该PKCS#8私钥中提取对应的公钥。
            // const publicKey = crypto.createPublicKey(privateKey);
            // const verify = crypto.createVerify('RSA-SHA1');
            // verify.update(dataToSign);
            // const isVerified = verify.verify(publicKey, signature);
            // console.log("签名验证结果 (需手动提取公钥实现):", isVerified);

        } else {
            console.error("a2(): 数据签名失败，返回 null 或空 Buffer。");
        }
    } catch (e) {
        console.error("a2(): 调用时发生异常:", e.message);
        if (e.cause) {
            console.error("  原始原因:", e.cause);
        }
    }

    // 测试 a2() 异常处理：传递 null 数据
    try {
        console.log("测试 a2() 使用 null 数据输入 (预期 Node.js crypto 会报错):");
        LicenseServer2ToJRebelPrivateKey.a2(null); // crypto.update(null) 会抛错
    } catch (e) {
        console.error("a2(null) 按预期抛出错误:", e.message);
    }
}

// 如果不是作为模块被导入，则运行测试 (确保 ByteUtil.js 可用)
if (require.main === module) {
    // 确保 ByteUtil.js 存在且能正常工作
    if (!ByteUtil || typeof ByteUtil.a2 !== 'function') {
        console.error("错误: ByteUtil.js 未正确加载或 ByteUtil.a2 不是函数。请确保 ByteUtil.js 存在且已正确导出。");
        console.error("预期的 ByteUtil.js 结构示例:");
        console.error("class ByteUtil { static a2(str) { return Buffer.from(str, 'base64'); } } module.exports = ByteUtil;");
    } else {
        runLicenseServerTests();
    }
}
*/