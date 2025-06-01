// Hex.js

// Node.js 的 Buffer 对象可以直接与字节数据交互。
// 此转换将遵循 Java 代码的逻辑，以方便对照。

class Hex {
    /**
     * 将字节数组转换为十六进制字符串。
     * Java 版本: public static String bytesToHexString(byte[] src)
     *
     * @param {Buffer} src - 要转换的字节数组 (在 Node.js 中应为 Buffer 对象)。
     * @returns {string | null} 转换后的十六进制字符串；如果源数据为 null 或长度为0，则返回 null。
     */
    static bytesToHexString(src) {
        // 在 JavaScript 中，使用一个空字符串并通过 += 操作来构建结果字符串，
        // 类似于 Java 中的 StringBuilder。
        let stringBuilder = "";

        // 检查输入源 src 是否为 null 或空。
        // 在 JavaScript 中, `src == null` 会同时检查 `null` 和 `undefined`。
        if (src == null || src.length === 0) {
            return null;
        }

        for (let i = 0; i < src.length; i++) {
            // src[i] 在 Node.js Buffer 中直接返回一个 0-255 范围内的无符号字节值。
            // Java 中的 `src[i] & 0xFF` 是为了将可能为负的 byte 类型值转换为 0-255 的 int 值。
            // 为了与 Java 代码的意图保持一致并方便对照，我们保留 `& 0xFF`，
            // 尽管对于 Buffer 中的字节 `src[i]` (已经是 0-255)，此操作不会改变其值。
            const v = src[i] & 0xFF;

            // 将整数 v 转换为其十六进制表示的字符串。
            // JavaScript 的 `Number.prototype.toString(16)` 等同于 Java 的 `Integer.toHexString()`。
            // 两者默认都输出小写十六进制字符。
            let hv = v.toString(16);

            // 如果十六进制字符串长度小于2（例如，对于值 0-15，结果是 "0" 到 "f"），
            // 则在前面补一个 '0'，以确保每个字节都表示为两个十六进制字符。
            if (hv.length < 2) {
                stringBuilder += '0';
            }
            stringBuilder += hv;
        }
        return stringBuilder;
    }
}

// 如果您想在 Node.js 项目中将这个类作为一个模块使用，可以导出它：
module.exports = Hex;

// ----- 可选的测试代码 -----
/*
function runHexTests() {
    console.log("测试 Hex.bytesToHexString 功能:");

    // 测试用例 1: 正常字节数组
    const buffer1 = Buffer.from([0x1, 0x23, 0xAF, 0x0D, 0xFF]);
    const expectedHex1 = "0123af0dff";
    const actualHex1 = Hex.bytesToHexString(buffer1);
    console.log(`Buffer [0x1, 0x23, 0xAF, 0x0D, 0xFF] -> "${actualHex1}"`, actualHex1 === expectedHex1 ? "(正确)" : `(错误, 期望: ${expectedHex1})`);

    // 测试用例 2: 包含0值的字节
    const buffer2 = Buffer.from([0x00, 0x05, 0xCC]);
    const expectedHex2 = "0005cc";
    const actualHex2 = Hex.bytesToHexString(buffer2);
    console.log(`Buffer [0x00, 0x05, 0xCC] -> "${actualHex2}"`, actualHex2 === expectedHex2 ? "(正确)" : `(错误, 期望: ${expectedHex2})`);

    // 测试用例 3: 空 Buffer
    const bufferEmpty = Buffer.from([]);
    const expectedHexEmpty = null; // Java 代码返回 null
    const actualHexEmpty = Hex.bytesToHexString(bufferEmpty);
    console.log(`空 Buffer ->`, actualHexEmpty, actualHexEmpty === expectedHexEmpty ? "(正确)" : `(错误, 期望: ${expectedHexEmpty})`);

    // 测试用例 4: null 输入
    const bufferNull = null;
    const expectedHexNull = null;
    const actualHexNull = Hex.bytesToHexString(bufferNull);
    console.log(`null 输入 ->`, actualHexNull, actualHexNull === expectedHexNull ? "(正确)" : `(错误, 期望: ${expectedHexNull})`);

    // 测试用例 5: 字符串转 Buffer 进行测试
    const textBuffer = Buffer.from("Hello", "utf8"); // H=48, e=65, l=6c, l=6c, o=6f
    const expectedHexText = "48656c6c6f";
    const actualHexText = Hex.bytesToHexString(textBuffer);
    console.log(`Buffer.from("Hello", "utf8") -> "${actualHexText}"`, actualHexText === expectedHexText ? "(正确)" : `(错误, 期望: ${expectedHexText})`);

    // Node.js Buffer.toString('hex') 的对比 (功能上等同，但实现方式不同)
    // console.log(`Buffer.from("Hello", "utf8").toString('hex') -> "${textBuffer.toString('hex')}"`);
}

// 如果不是作为模块被导入，则运行测试
if (require.main === module) {
    runHexTests();
}
*/