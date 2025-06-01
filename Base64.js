// 将这段Java代码转为完整Node环境都JavaScript代码，你会怎么写（代码有点长，你要完整的转换，不能遗漏, 转换时方法明和变量名都要相同，方便对照）：
// 注意：这个类我已经在本地的同级目录下完成了从Java到Javascript的转换，这里直接使用就行

class Base64 {
  /**
   * Decodes a Base64 encoded string.
   *
   * @param {string} str The Base64 encoded string.
   * @return {Buffer} A Buffer containing the decoded bytes.
   */
  static decode(str) {
    return Buffer.from(str, "base64");
  }
}

module.exports = Base64;

// Example usage (optional, for testing):
// const encodedString = "SGVsbG8gV29ybGQ="; // "Hello World" in Base64
// const decodedBuffer = Base64.decode(encodedString);
// console.log(decodedBuffer.toString('utf8')); // Output: Hello World
