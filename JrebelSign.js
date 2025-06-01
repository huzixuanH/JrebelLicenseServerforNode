// JrebelSign.js
const StringUtils = require('lodash/join'); // 使用 lodash 的 join 方法替代 Apache Commons Lang 的 StringUtils.join
const ByteUtil = require('./ByteUtil.js');
const LicenseServer2ToJRebelPrivateKey = require('./LicenseServer2ToJRebelPrivateKey.js');

class JrebelSign {
    constructor() {
        this.signature = null;
    }

    /**
     * 根据提供的参数生成签名。
     * 对应 Java 方法: public void toLeaseCreateJson(String clientRandomness, String guid, boolean offline, String validFrom, String validUntil)
     *
     * @param {string} clientRandomness - 客户端随机数。
     * @param {string} guid - 安装 GUID。
     * @param {boolean} offline - 是否离线。
     * @param {string} validFrom - 有效期开始日期。
     * @param {string} validUntil - 有效期结束日期。
     */
    toLeaseCreateJson(clientRandomness, guid, offline, validFrom, validUntil) {
        const serverRandomness = "H2ulzLlh7E0="; // 服务端随机数,如果要自己生成，务必将其写到json的serverRandomness中
        const installationGuidString = guid;
        let s2 = "";

        // 根据 offline 参数拼接字符串
        if (offline) {
            // 注意：Java 中的 String.valueOf(boolean) 会返回 "true" 或 "false"
            s2 = StringUtils([clientRandomness, serverRandomness, installationGuidString, String(offline), validFrom, validUntil], ';');
        } else {
            s2 = StringUtils([clientRandomness, serverRandomness, installationGuidString, String(offline)], ';');
        }

        console.log(s2);

        // 将字符串转换为 Buffer (字节数组)，然后进行签名
        // Java 中的 s2.getBytes() 默认使用平台编码，通常是 UTF-8。Node.js 中 Buffer.from(string) 默认也使用 UTF-8。
        const a2 = LicenseServer2ToJRebelPrivateKey.a2(Buffer.from(s2, 'utf8'));
        this.signature = ByteUtil.a1(a2);
    }

    /**
     * 获取生成的签名。
     * 对应 Java 方法: public String getSignature()
     *
     * @returns {string} 签名字符串。
     */
    getSignature() {
        return this.signature;
    }
}

module.exports = JrebelSign;