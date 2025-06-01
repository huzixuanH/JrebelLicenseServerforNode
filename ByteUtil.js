class ByteUtil {
  static a;

  static {
    ByteUtil.a = {};
  }

  /**
   * 将字节数组 (Buffer) 进行 Base64 编码，并返回结果字符串。
   *
   * @param {Buffer} binaryData - 要进行 Base64 编码的字节数组 (Node.js 中的 Buffer 对象)。
   * @returns {string | null} Base64 编码后的字符串；如果输入 binaryData 为 null，则返回 null。
   */
  static a1(binaryData) {
    if (binaryData == null) {
      return null;
    }
    return binaryData.toString("base64");
  }

  /**
   * 将 Base64 编码的字符串解码为字节数组 (Buffer)。
   *
   * @param {string} s - Base64 编码的字符串。
   * @returns {Buffer | null} 解码后的字节数组 (Node.js 中的 Buffer 对象)；如果输入 s 为 null，则返回 null。
   */
  static a2(s) {
    if (s == null) {
      return null;
    }
    return Buffer.from(s, "base64");
  }
}

module.exports = ByteUtil;
