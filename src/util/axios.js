import axios from 'axios';
import { Message, MessageBox } from 'element-ui';
import { path } from './path';
import util from './util';
import { aes, aesKey, getFileMD5s, sign } from './crypto';
import router from '../router';
import store from '../store/store';

// http request 拦截器

let _level = util.config.level;
let baseURL = util.config.baseUrl;

// let baseURL = '/platform-api';
// axios.defaults.baseURL = baseURL;
//axios.defaults.timeout = 10000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
axios.interceptors.request.use(
    config => {
        // let reallyBaseUrl = store.state.baseStatus;
        // if(reallyBaseUrl == 1){
        //     config.baseURL = 'http://192.168.1.126:10016'
        // }else if(reallyBaseUrl == 2){
        //     config.baseURL = 'http://192.168.1.126:10016'
        // }else if(reallyBaseUrl == 3){
        //     config.baseURL = 'http://25.95.160.103:9098'
        // }
        //config.baseURL = 'http://127.0.0.1:10016'
        // 将token加入请求头
        let token = util.get("token");
        let remember = util.get("remember");
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        if (remember) {
            config.headers['x-auth-remember'] = remember;
        }
        //console.log('config',config.headers);
        //config.headers['Content-Type'] = 'application/json;charset=utf-8';
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

// http response 拦截器
axios.interceptors.response.use(
    response => {
        // console.log('response',response);
        if (response.data.code == 401) {
            // err.message = '未授权，请重新登录(401)';
            Message.error("没有权限或会话已过期，请重新登录！")
            MessageBox.confirm(
                '登录状态已过期，您可以继续留在该页面，或者重新登录',
                '系统提示',
                {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).then(() => {
                store.commit('logout');
                location.reload() // 为了重新实例化vue-router对象 避免bug

            })
        }
        return response;
    },
    err => {
        if (err && err.response) {
            console.log(err)
            switch (err.response.status) {
                case 400:
                    err.message = '请求错误(400)';
                    break;
                case 401:
                    // err.message = '未授权，请重新登录(401)';
                    Message.error("没有权限或会话已过期，请重新登录！")
                    MessageBox.confirm(
                        '登录状态已过期，您可以继续留在该页面，或者重新登录',
                        '系统提示',
                        {
                            confirmButtonText: '重新登录',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }
                    ).then(() => {
                        store.commit('logout');
                        location.reload() // 为了重新实例化vue-router对象 避免bug

                    })
                    // store.commit('logout');
                    // router.push({ name: 'login' });
                    break;
                case 403:
                    err.message = '拒绝访问(403)';
                    break;
                case 404:
                    err.message = '请求出错(404)';
                    break;
                case 408:
                    err.message = '请求超时(408)';
                    break;
                case 500:
                    err.message = '服务器错误(500)';
                    break;
                case 501:
                    err.message = '服务未实现(501)';
                    break;
                case 502:
                    err.message = '网络错误(502)';
                    break;
                case 503:
                    err.message = '服务不可用(503)';
                    break;
                case 504:
                    err.message = '网络超时(504)';
                    break;
                case 505:
                    err.message = 'HTTP版本不受支持(505)';
                    break;
                default:
                    err.message = `连接出错(${err.response.status})!`;
            }
        } else {
            err.message = '连接服务器失败!';
        }
        Message.error(err.message);
        return Promise.reject(err);
    }
);

let response_aes_key = "lhzw1234";

/**
 * 封装get方法
 * @param group
 * @param method
 * @returns {Promise}
 */

export function get(group, method, params = {}) {
    return new Promise((resolve, reject) => {
        axios(getConfig(path[group][method], 'get', params, _level, 'text')).then(response => {
            //console.log('response',response);
            let ret = response.data;
            if (ret) {
                //ret = JSON.parse(ret);
                resolve(ret);
            }
        }).catch(err => {
            reject(err);
        });
    });
}
export function get2(url, method, params = {}) {
    return new Promise((resolve, reject) => {
        axios(getConfig(url, 'get', params, _level, 'json')).then(response => {
            //console.log('response',response);
            let ret = response;
            if (ret) {
                //ret = JSON.parse(ret);
                resolve(ret);
            }
        }).catch(err => {
            reject(err);
        });
    });
}

/**
 * 封装post请求
 * @param group
 * @param method
 * @returns {Promise}
 */
export function post2(group, method, data = {}, xml = '') {
    return new Promise((resolve, reject) => {
        axios(getConfig(path[group][method], 'post', data, _level, 'text', xml)).then(response => {
            // console.log('sdfa')
            // console.log('response',response);
            let ret = response.data;
            if (ret) {
                //ret = JSON.parse(ret);
                resolve(ret);
            }
        }, err => {
            reject('1', err);
        });
    });
}

export function post(group, method, data = {}, xml) {
    // console.log('come post')
    return new Promise((resolve, reject) => {
        axios(getConfig(path[group][method], 'post', data, _level, 'text')).then(response => {
            //console.log('response',response);
            let ret = response.data;
            if (ret) {
                //ret = JSON.parse(ret);
                resolve(ret);
            }
        }, err => {
            reject('1', err);
        });
    });
}

export function ajax(config, callback) {
    return new Promise((resolve, reject) => {
        axios(config).then(response => {
            // console.log(response.data)
            let ret = response.data;
            if (_level === util.securityLevel.crypto || _level === util.securityLevel.signAndCrypto) {
                ret = aes.de(ret, response_aes_key, response_aes_key);
                if (ret) {
                    ret = JSON.parse(ret);
                    response.data = ret;
                }
            }
            if (verifySign(response)) {
                if (ret.code == 200) {
                    // console.log('ret.....')
                    // console.log(ret.data)
                    // ret.data = JSON.parse(ret.data);
                    callback(ret);
                } else if (ret.code === 401) {
                    Message.error("没有权限或会话已过期，请重新登录！")
                    store.commit('logout');
                    router.push({ name: 'login' });
                } else {
                    // console.log(ret.code)
                    Message.error(ret.msg);
                    reject(ret);
                }
            } else {
                Message.error("签名未通过");
                reject(ret);
            }
        }, err => {
            reject(err);
        });
    }).catch((e) => { });
}

export function postForKey(group, method, data = {}) {
    let param = new URLSearchParams();
    if (data) {
        for (var x in data) {
            param.append(x, data[x]);
        }
    }
    return new Promise((resolve, reject) => {
        axios.post(path[group][method], param)
            .then(response => {
                let ret = response.data;
                try {
                    response.data.data = JSON.parse(ret.data);
                } catch (e) {
                }
                resolve(response);
            }, err => {
                reject(err);
            });
    });
}

export function postForLogin(group, method, data = {}, rsaKey, randomKey) {
    let param = new URLSearchParams();
    if (data) {
        for (var x in data) {
            param.append(x, data[x]);
        }
    }
    return new Promise((resolve, reject) => {
        axios(getConfig(path[group][method], 'post', data, _level, 'text', rsaKey, randomKey))
            .then(response => {
                let ret = response.data;
                if (_level === util.securityLevel.crypto || _level === util.securityLevel.signAndCrypto) {
                    ret = aes.de(ret, response_aes_key, response_aes_key);
                    if (ret) {
                        ret = JSON.parse(ret);
                        response.data = ret;
                    }
                }
                if (ret.data) {
                    response.data.data = JSON.parse(ret.data);
                }
                resolve(response);
            }, err => {
                reject(err);
            });
    });
}

export function downloadPhoto(title, url, params = {}, callback, rsaKey, randomKey) {
    axios(getConfig(url, 'get', params, _level, 'blob', rsaKey, randomKey)).then(res => {
        let blob = new Blob([res.data]);
        let imageUrl = window.URL.createObjectURL(blob);
        // console.log(res.data);
        // console.log(blob);
        // console.log(imageUrl);
        callback(imageUrl, res.data);
    })
}

export function downloadFile(title, url, params = {}) {
    axios(getConfig(url, 'get', params, _level, 'blob')).then(res => {
        //这里res.data是返回的blob对象
        let blob = new Blob([res.data]); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
        let downloadElement = document.createElement('a');
        let href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.href = href;
        downloadElement.download = title; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象
    })
}
export function postDownloadFile(title, url, params) {
    axios(getConfig(url, 'post', params, _level, 'blob')).then(res => {
        //这里res.data是返回的blob对象
        let blob = new Blob([res.data]); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
        let downloadElement = document.createElement('a');
        let href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.href = href;
        downloadElement.download = title; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象
    })
}

export function downloadExcel(url, params = {}, callback) {
    axios(getConfig(url, 'post', params, _level, 'blob')).then(res => {
        if (res.headers['content-disposition']) {
            var index = res.headers['content-disposition'].indexOf('filename=');
            var str = res.headers['content-disposition'].substring(index + 10, res.headers['content-disposition'].length - 1);
            var title = decodeURI(escape(str));
            //这里res.data是返回的blob对象
            let blob = new Blob([res.data]); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
            let downloadElement = document.createElement('a');
            let href = window.URL.createObjectURL(blob); //创建下载的链接
            downloadElement.href = href;
            downloadElement.download = title; //下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); //点击下载
            document.body.removeChild(downloadElement); //下载完成移除元素
            window.URL.revokeObjectURL(href); //释放掉blob对象
        }
        callback(res)
    })
}
export const uploadFileRequest = (url, params, fileItems, callback) => {
    // console.log(params);
    // console.log('upd');
    let config_ = getConfig(url, 'post', params, _level, 'text');
    // console.log(config_);
    let param = config_.tmp;
    // console.log(param)
    config_.headers['Content-Type'] = 'multipart/form-data';
    var formData = new FormData();
    for (let i in param) {
        formData.append(i, param[i]);
    }
    for (let i in fileItems) {
        formData.append('file', fileItems[i]);
    }
    config_.data = formData;
    // console.log(config_)

    // console.log(config_.data)
    getFileMD5s(fileItems, config_, ajax, callback);
    return;
}

/**
 * @param url 请求url
 * @param method get,post,put,delete
 * @param params 参数
 * @param level 0:无加密，1: 签名+时间戳，2：参数加密，3：先验签再加密；默认0
 */
const getConfig = (url, method, params, level = 0, type = "json", rsaKey, randomKey) => {
    if (!rsaKey) {
        rsaKey = util.get('rsaKey');
    }
    let config_ = {
        url,
        method,
        // params, data,
        responseType: type,
        headers: {}
    };
    // 时间戳
    if (level === util.securityLevel.sign || level === util.securityLevel.signAndCrypto) { // 签名
        let timestamp = new Date().getTime();
        let token = util.get("token");
        let signstr = sign(token, timestamp, params);
        config_.headers = {
            timestamp: timestamp,
            sign: signstr
        };
    }
    if (level === util.securityLevel.crypto || level === util.securityLevel.signAndCrypto) { // 加密
        let key = aesKey(32);
        params = { encrypt: aes.en(JSON.stringify(params), key, key) };
        let encryptor = new JSEncrypt();
        encryptor.setPublicKey(rsaKey);
        config_.headers["key"] = encryptor.encrypt(key);
        if (randomKey) {
            config_.headers["randomKey"] = randomKey;
        }
    }

    // 设置参数
    if (method === 'get') {
        config_.params = params;
    } else if (method === 'post') {
        // let param = new URLSearchParams();
        // if (params) {
        //     for (var x in params) {
        //         if (Array.isArray(params[x])) {
        //             param.append(x, JSON.stringify(params[x]));
        //         } else {
        //             param.append(x, params[x]);
        //         }
        //     }
        // }
        // config_.data = param;
        // // config_.tmp = params;
        config_.headers['Content-Type'] = 'application/json';
        config_.data = params;
    }
    //console.log('config_',config_);
    return config_;
};

const verifySign = (response) => {
    // 时间戳
    if (_level === util.securityLevel.normal) {
        return true;
    } else if (_level === util.securityLevel.sign) {  // 签名
        let timestamp = response.headers.timestamp;
        let signResp = response.headers.sign;
        let token = util.get("token");
        let signstr = sign(token, timestamp, response.data);
        return signResp == signstr;
    } else if (_level === util.securityLevel.crypto) { // 加密
        return true;
    } else if (_level === util.securityLevel.signAndCrypto) { // 加密
        return true;
    }
};
