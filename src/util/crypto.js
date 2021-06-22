import CryptoJS from 'crypto-js';
import SparkMD5 from 'spark-md5';

function getAesString(data, key, iv) { // 加密
  key = CryptoJS.enc.Utf8.parse(md5(key).substring(0, 16).toLowerCase());
  // alert(key）;
  iv = CryptoJS.enc.Utf8.parse(md5(iv).substring(0, 16).toLowerCase());
  let srcs = data;
  let encrypted = CryptoJS.AES.encrypt(srcs, key,
    {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  let ret = encrypted.ciphertext;
  return ret.toString();    // 返回的是base64格式的密文
}

function getDAesString(encrypted, key, iv) { // 解密
    key = CryptoJS.enc.Utf8.parse(md5(key).substring(0, 16).toLowerCase());
    iv = CryptoJS.enc.Utf8.parse(md5(iv).substring(0, 16).toLowerCase());
    let encryptedHexStr = CryptoJS.enc.Hex.parse(encrypted);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypted = CryptoJS.AES.decrypt(srcs, key,
    {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

// AES 对称秘钥加密
const aes = {
  en: (data, key, iv) => getAesString(data, key, iv),
  de: (data, key, iv) => getDAesString(data, key, iv)
};
// BASE64
const base64 = {
  en: (data) => CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data)),
  de: (data) => CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8)
};
// SHA256
const sha256 = (data) => {
  return CryptoJS.SHA256(data).toString();
};
// MD5
const md5 = (data) => {
  return CryptoJS.MD5(data).toString();
};

/**
 * 签名
 * @param token 身份令牌
 * @param timestamp 签名时间戳
 * @param data 签名数据
 */
const sign = (token, timestamp, data) => {
  // 签名格式： timestamp + token + data(字典升序)
  let keys = [];
  let tmp = {};
  for (let it in data) {
    let val = data[it];
    if (typeof val === 'object') {
      val = JSON.stringify(val);
    }
    //   (!(val instanceof Array) || (val.length > 0 && (typeof val[0] === 'object')))) {
    //   val = JSON.stringify(val);
    // }
    tmp[it] = val;
    keys.push(it);
  }
  // 字典升序
  keys.sort();
  let signsrc = timestamp + token;
  for (var i in keys) {
    signsrc += keys[i] + tmp[keys[i]];
  }
  return md5(signsrc).toUpperCase();
};

/**
 * 签名
 * @param token 身份令牌
 * @param timestamp 签名时间戳
 * @param data 签名数据
 */
const getFileMD5s = (files=[],config_,ajax,callback) => {
  let filemd5s = [];
  if(files.length>0){
    let index = 0;
    let file = files[index++];
    let blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice;
    let chunkSize = 2097152; // read in chunks of 2MB
    let chunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;
    let spark = new SparkMD5.ArrayBuffer();
    let frOnload = function (e) {
      spark.append(e.target.result); // append array buffer
      let md5 = spark.end();
      console.log("md5:" + md5);
      filemd5s.push(md5);
      if(index<files.length){
        file = files[index++];
        loadNext();
      }else {
        config_.headers["filemd5s"] = JSON.stringify(filemd5s);
        ajax(config_,callback);
      }
    };
    let frOnerror = function () {
      console.log("wrong");
    };

    let loadNext = function() {
      var fileReader = new FileReader();
      fileReader.onload = frOnload;
      fileReader.onerror = frOnerror;
      var start = currentChunk * chunkSize,
        end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    };
    loadNext();
  }
  return filemd5s;
};


/**
 * 生成随机AES秘钥
 */
let aesKey = (len) => {
  len = len || 32;
  let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  let maxPos = $chars.length;
  let keyStr = '';
  for (let i = 0; i < len; i++) {
    keyStr += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return keyStr;
};

export {
  aes,
  md5,
  sha256,
  base64,
  sign,
  aesKey,
  getFileMD5s
};
