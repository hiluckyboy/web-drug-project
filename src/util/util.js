let util = {};
const securityLevel = {
    normal: 0,
    sign: 1,
    crypto: 2,
    signAndCrypto: 3
};
util.securityLevel = securityLevel;
const baseConfig = {
    env: 'dev'
};
const utilIp = '10.10.10.252';
// const utilIp = '10.10.10.222';
// const utilIp = '10.13.25.111';
const devConfig = {
    baseUrl: 'http://' + utilIp + ':10016', //http://192.168.2.123:8080
    webSocketUrl: utilIp + ':10016/imserver',
    level: securityLevel.normal
};
const testConfig = {
    baseUrl: 'http://' + utilIp + ':10016',
    webSocketUrl: utilIp + ':10016/imserver',
    level: securityLevel.sign
};
const prodConfig = {
    baseUrl: 'http://' + utilIp + ':10016', //http://192.168.2.123:8080
    webSocketUrl: utilIp + ':10016/imserver',
    level: securityLevel.sign
};

if (baseConfig.env === 'dev')
    util.config = Object.assign(baseConfig, devConfig);
else if (baseConfig.env === 'test')
    util.config = Object.assign(baseConfig, testConfig);
else if (baseConfig.env === 'prod')
    util.config = Object.assign(baseConfig, prodConfig);


util.formatRoutes = function (routes, parentFullTitle) {
    // console.log(routes)
    let compKanBanFmt
    let comChildren = []

    let campKanBanFmt
    let camChildren = []

    let homeFmt
    let homeChildren = []
    routes.forEach((router) => {
        if (router.title == '营区动态管理left' || router.title == '营区动态管理right' || router.title == '仓库信息融合展现菜单left' || router.title == '仓库信息融合展现菜单right' || router.title == '看板菜单') {
            // console.log(router, '==========================================')

            if (router.title == '看板菜单') {

            } else {
                let title
                if (router.title.indexOf('仓库信息融合展现') != -1) {
                    title = '仓库信息融合展现'
                    // console.log(router,'...........................')
                } else {
                    title = '营区动态管理'
                }
                function rouFun(res, title) {
                    // console.log(res)
                    res.forEach(element => {
                        if (element.children.length != 0) {
                            rouFun(element.children, title)
                        } else {

                        }
                    });
                }
                rouFun(router.children, title)
            }
        } else {
            function rouFun(res) {
                // console.log(res)
                res.forEach(element => {
                    if (element.children.length != 0) {
                        rouFun(element.children)
                    } else {
                        if (element.path.indexOf('http') == -1) {
                            homeChildren.push({
                                name: element.name,
                                title: element.title,
                                meta: { title: "影响驾驶能力药物查询系统" },
                                path: element.path,
                                component: function (resolve) {
                                    require(['@/views/' + element.component + '.vue'], resolve)
                                }
                            })
                        }

                    }
                });
            }
            console.log(router.children)
            rouFun(router.children)
        }
    })

    homeFmt = {
        name: 'home',
        title: '影响驾驶能力药物查询系统',
        meta: { title: "影响驾驶能力药物查询系统" },
        path: '/Home',
        component: function (resolve) {
            require(['@/views/' + 'Home' + '.vue'], resolve)
        },
        children: homeChildren
    };
    return [homeFmt]
};

util.set = function (key, value) {
    if (typeof value === "object") {
        sessionStorage.setItem(key, JSON.stringify(value))
    } else {
        sessionStorage.setItem(key, value);
    }
};
util.get = function (key) {
    return sessionStorage.getItem(key);
};
util.remove = function (key) {
    sessionStorage.removeItem(key);
};
util.format = function (date,format) {
    var o = {
        "M+": date.getMonth() + 1, //month
        "d+": date.getDate(), //day
        "h+": date.getHours(), //hour
        "m+": date.getMinutes(), //minute
        "s+": date.getSeconds(), //second
        "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
        "S": date.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}
export default util;
