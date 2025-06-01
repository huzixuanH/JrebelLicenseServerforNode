class Hex {
  /**
   *
   * @param {Buffer} src - 要转换的字节数组 (在 Node.js 中应为 Buffer 对象)。
   * @returns {string | null} 转换后的十六进制字符串；如果源数据为 null 或长度为0，则返回 null。
   */
  static bytesToHexString(src) {
    let stringBuilder = "";
    if (src == null || src.length === 0) {
      return null;
    }

    for (let i = 0; i < src.length; i++) {
      const v = src[i] & 0xff;

      let hv = v.toString(16);
      if (hv.length < 2) {
        stringBuilder += "0";
      }
      stringBuilder += hv;
    }
    return stringBuilder;
  }
}

module.exports = Hex;
