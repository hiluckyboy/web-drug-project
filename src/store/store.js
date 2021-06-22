import Vue from 'vue'
import Vuex from 'vuex'
import tabView from './modules/tabView'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: {
            name: sessionStorage.getItem('user') == null ? '未登录' : JSON.parse(sessionStorage.getItem('user')).name,
            userface: sessionStorage.getItem('user') == null ? '' : JSON.parse(sessionStorage.getItem('user')).userface,
            username: sessionStorage.getItem('user') == null ? '' : JSON.parse(sessionStorage.getItem('user')).username,
            id: sessionStorage.getItem('user') == null ? '' : JSON.parse(sessionStorage.getItem('user')).id,
            orgId: sessionStorage.getItem('user') == null ? '' : JSON.parse(sessionStorage.getItem('user')).orgId,
            orgPids: sessionStorage.getItem('user') == null ? '' : JSON.parse(sessionStorage.getItem('user')).orgPids,
            account: sessionStorage.getItem('user') == null ? '' : JSON.parse(sessionStorage.getItem('user')).account,
            admin: sessionStorage.getItem('user') == null ? '' : JSON.parse(sessionStorage.getItem('user')).admin
        },
        routes: [],//sessionStorage.getItem('routes') == null ?[]:JSON.parse(sessionStorage.getItem('routes')),
        isFullScreen: false,
        menuTheme: 'dark', // 主题
        currentPath: [
            {
                path: '',
                name: 'home',
                title: '首页'
            }
        ], // 面包屑数组
        messageCount: 0,
        baseStatus: 1,
        loginBtn: true,
        username: '',
    },
    mutations:
        {
            changeLoginBtn(state,loginBtn) {
                state.loginBtn = loginBtn
            },
            changeUsername(state,username) {
                state.username = username
            },
            changeBaseUrl(state,status) {
                state.baseStatus = status;
            },
            initMenu(state, menus) {
                state.routes = menus;
            }
            ,
            login(state, user) {
                state.user = user;
                sessionStorage.setItem('user', JSON.stringify(user));
            }
            ,
            logout(state) {
                sessionStorage.removeItem('user');
                localStorage.removeItem('routes');
                state.user = {};
                state.routes = [];
                location.reload();
                state.tabView.visitedViews = [];
                state.tabView.cachedViews = [];
                sessionStorage.removeItem("tab_visitedViews");
                sessionStorage.removeItem("tab_cachedViews");
            }
            ,
            setCurrentPath(state, path) {
                state.currentPath = path;
            }
            ,
            changeTheme(state) {
                if (state.menuTheme == 'dark')
                    state.menuTheme = 'light';
                else
                    state.menuTheme = 'dark';
            },
        }
    ,
    actions: {}
    ,
    modules: {
        tabView
    }

})
;
