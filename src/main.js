//import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router';
import store from './store/store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/theme/theme-lhzw/index.css'
import echarts from 'echarts'
import "echarts/map/js/china.js";
import "echarts/map/js/world.js";
import { post, post2, get, get2, postForLogin, downloadFile, postDownloadFile, downloadExcel, downloadPhoto, postForKey, uploadFileRequest } from './util/axios';
import { checkData } from './common/js/common_js'
import util from './util/util';
import error404 from '@/views/404.vue';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'
import '../src/assets/alIconfont/iconfont.css'
import '../src/assets/filer/jquery.filer.css'
import '../src/assets/filer/jquery.filer.drop.css'
import './styles/common.css';
import scroll from 'vue-seamless-scroll';
import animated from 'animate.css'
import _ from "lodash";
// 导出execl
import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)


import './util/dialog'
import VueResource from 'vue-resource'
Vue.use(VueResource)

Vue.use(animated);
Vue.use(ElementUI);
Vue.use(scroll);
Vue.use(_);

import 'video.js/dist/video-js.css' // 引入样式
import 'vue-video-player/src/custom-theme.css' // 引入样式
import 'videojs-flash'

import x2js from 'x2js' //xml数据处理插件
Vue.prototype.$x2js = new x2js(); //全局方法挂载
Vue.prototype.$echarts = echarts;
Vue.prototype.$post = post;
Vue.prototype.$post2 = post2;
Vue.prototype.$get = get;
Vue.prototype.$get2 = get2;
Vue.prototype.$postForLogin = postForLogin;
Vue.prototype.$downloadFile = downloadFile;
Vue.prototype.$postDownloadFile = postDownloadFile;
Vue.prototype.$downloadExcel = downloadExcel;
Vue.prototype.$downloadPhoto = downloadPhoto;
Vue.prototype.$postForKey = postForKey;
Vue.prototype.$uploadFileRequest = uploadFileRequest;
Vue.prototype.$config = util.config;
Vue.prototype.$checkData = checkData



Vue.prototype.$EventBus = new Vue()

Vue.config.productionTip = false;

NProgress.configure({ showSpinner: false });
const whiteList = [];
/*
router.beforeEach((to, from, next) => {
    NProgress.start();
    if (to.meta.title) {
        document.title = to.meta.title
    }
    let isLogin = sessionStorage.getItem('user') != null;
    if (isLogin && store.state.routes.length == 0) {
        let menuList = util.formatRoutes(JSON.parse(JSON.parse(localStorage.getItem('routes'))));
        router.addRoutes(menuList);
        router.addRoutes([{
            path: '/*',
            name: 'error404',
            component: error404,
            meta: {
                title: 'error404',
                fullTitle: "error404"
            }
        }]);
        store.commit('initMenu', menuList);
        for (let i in menuList) {
            if (menuList[i].path == to.path) {
                next({
                    name: menuList[i].name
                });
                NProgress.done();
                return;
            }
            if (menuList[i].children && menuList[i].children.length > 0) {
                for (let j in menuList[i].children) {
                    if (menuList[i].children[j].path == to.path) {
                        next({
                            name: menuList[i].children[j].name
                        });
                        NProgress.done();
                        return;
                    }
                }
            }
        }
    }

    if (to.name === 'error404') {
        next();
        NProgress.done();
        return;
    }
    if (!isLogin && to.name !== 'login') { // 判断是否已经登录且前往的页面不是登录页
        if (whiteList.indexOf(to.path) !== -1) {
            next();
        } else {
            next({
                name: 'login'
            });
        }

        NProgress.done();
        return;
    } else if (!isLogin && to.name !== 'login') { // 判断是否已经登录且前往的页面不是登录页
        next({
            name: 'login'
        });
        NProgress.done();
        return;
    } else if (isLogin && to.name === 'login') { // 判断是否已经登录且前往的是登录页
        next({
            name: 'home'
        });
        NProgress.done();
        return;
    } else {
        NProgress.done();
        next();
    }
});
*/
// router.afterEach(transition => {
//     NProgress.done();
// });

new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
});
