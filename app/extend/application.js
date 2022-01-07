'use strict';

const crypto = require('crypto');

module.exports = {
  /**
   * @description 生成唯一值
   * @param {Number} len 长度
   * @param {Number} radix 基数
   */
  createUuid(len, radix) {
    const chars =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
        ''
      );
    const uuid = [];
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (let i = 0; i < len; i++) {
        uuid[i] = chars[0 | (Math.random() * radix)];
      }
    } else {
      // rfc4122, version 4 form
      let r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (let i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | (Math.random() * 16);

          uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  },

  /**
   * aes加密
   * @param {string} data 待加密内容
   * @param {string} key 必须为32位私钥
   * @param {string} iv 用于指定加密时所用的向量，一般不填
   * @return {string} 加密的消息
   */
  encryption(data, key = this.config.keys, iv) {
    iv = iv || '';
    const clearEncoding = 'utf8';
    const cipherEncoding = 'base64';
    const cipherChunks = [];
    const cipher = crypto.createCipheriv('aes-256-ecb', key, iv);
    cipher.setAutoPadding(true);
    cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
    cipherChunks.push(cipher.final(cipherEncoding));
    return cipherChunks.join('');
  },

  /**
   * aes解密
   * @param {string}  data 待解密内容
   * @param {string}  key 必须为32位私钥
   * @param {string} iv 用于指定加密时所用的向量，一般不填
   * @return {string} 已解密的数据
   */
  decryption(data, key = this.config.keys, iv) {
    if (!data) {
      return '';
    }
    iv = iv || '';
    const clearEncoding = 'utf8';
    const cipherEncoding = 'base64';
    const cipherChunks = [];
    const decipher = crypto.createDecipheriv('aes-256-ecb', key, iv);
    decipher.setAutoPadding(true);
    cipherChunks.push(decipher.update(data, cipherEncoding, clearEncoding));
    cipherChunks.push(decipher.final(clearEncoding));
    return cipherChunks.join('');
  },
};
