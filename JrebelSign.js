const ByteUtil = require("./ByteUtil.js");
const LicenseServer2ToJRebelPrivateKey = require("./LicenseServer2ToJRebelPrivateKey.js");

class JrebelSign {
  constructor() {
    this.signature = null;
  }

  /**
   * 根据提供的参数生成签名。
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

    if (offline) {
      s2 = [
        clientRandomness,
        serverRandomness,
        installationGuidString,
        String(offline),
        validFrom,
        validUntil,
      ].join(";");
    } else {
      s2 = [
        clientRandomness,
        serverRandomness,
        installationGuidString,
        String(offline),
      ].join(";");
    }

    console.log(s2);

    const a2 = LicenseServer2ToJRebelPrivateKey.a2(Buffer.from(s2, "utf8"));
    this.signature = ByteUtil.a1(a2);
  }

  /**
   * 获取生成的签名。
   * @returns {string} 签名字符串。
   */
  getSignature() {
    return this.signature;
  }
}

module.exports = JrebelSign;
