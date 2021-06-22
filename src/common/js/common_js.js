/**
 * 时间格式化函数
 * @param {*} e 时间戳和需要的格式化类型
 */
export function formatTimestamp(time = 0, fmt = "yyyy-MM-dd hh:mm:ss") {
    if (time === 0 || !time) {
        return "";
    }

    let date = new Date(time);
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }
    let o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + "";
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1 ? str : ("00" + str).substr(str.length)
            );
        }
    }
    return fmt;
}
/*
    正则校验不能输入中文
*/
export function checkData(rule, value, callback) {
    //   console.log(value);
    if (value) {
        if (/[\u4E00-\u9FA5]/g.test(value)) {
            callback(new Error("不能输入汉字!"));
        } else {
            callback();
        }
    } else {
        return callback(new Error("必填：不能为空!"));
    }
}

export function unique(arr, u_key) {
    let map = new Map();
    arr.forEach((item, index) => {
        if (!map.has(item[u_key])) {
            map.set(item[u_key], item);
        }
    });
    return [...map.values()];
}

export function fullScreen(el) {
    var rfs =
        el.requestFullScreen ||
        el.webkitRequestFullScreen ||
        el.mozRequestFullScreen ||
        el.msRequestFullScreen,
        wscript;

    if (typeof rfs != "undefined" && rfs) {
        rfs.call(el);
        return;
    }

    if (typeof window.ActiveXObject != "undefined") {
        wscript = new ActiveXObject("WScript.Shell");
        if (wscript) {
            wscript.SendKeys("{F11}");
        }
    }
}

export function exitFullScreen(el) {
    var el = document,
        cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen,
        wscript;

    if (typeof cfs != "undefined" && cfs) {
        cfs.call(el);
        return;
    }

    if (typeof window.ActiveXObject != "undefined") {
        wscript = new ActiveXObject("WScript.Shell");
        if (wscript != null) {
            wscript.SendKeys("{F11}");
        }
    }
}
