<template>
    <el-row class="container">
        <el-col :span="24" class="header">
            <el-col :span="24" class="userInfo">
                <el-dropdown
                    size="medium"
                    trigger="click"
                    @command="handleCommand"
                    style="display: flex; align-items: center; justify-content: flex-end"
                >
                  <span
                      class="el-dropdown-link userinfo-Inner"
                      style="padding-right: 10px"
                  >{{ $store.state.user.name }}</span>
                    <img src="/static/user.png" class="user" style="width: 25px" alt=""/>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="">首页</el-dropdown-item>
                        <el-dropdown-item @click.native="logout()">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-col>
        <el-col :span="24" class="main">
            <aside class="menu-expanded">
                <!--导航菜单-->
                <el-menu
                    class="sidebar-el-menu"
                    :default-active="$route.path"
                    text-color="#fff"
                    active-text-color="#20a0ff"
                    unique-opened
                    router
                >
                    <template v-for="(item, index) in this.routes" v-if="!item.hidden">
                        <el-submenu :index="index + ''" :key="item.index" v-if="!item.leaf">
                            <template slot="title">
                                <span slot="title" class="side_name">{{ item.title }}</span>
                            </template>
                            <el-menu-item
                                class="child_menu"
                                v-for="child in item.children"
                                :index="child.path"
                                :key="child.path"
                                v-if="!child.hidden"
                                :class="$route.path == child.path ? 'is-act' : ''"
                            >
                                <span slot="title" class="side_name">{{ child.title }}</span>
                            </el-menu-item>
                        </el-submenu>
                        <el-menu-item
                            v-if="item.leaf && item.children.length > 0"
                            :index="item.children[0].path"
                            :class="$route.path == item.children[0].path ? 'is-act' : ''"
                        >
                            <!-- <i :class="item.icon"></i> -->
                            <span slot="title" class="side_name">
                                {{item.children[0].title}}
                            </span>
                        </el-menu-item>
                    </template>
                </el-menu>
            </aside>

            <section class="content-container" ref="wrap">
                <!--<tab-view></tab-view>-->
                <transition name="fade" mode="out-in">
                    <!--  <keep-alive :include="cachedViews">-->
                    <router-view :key="key"></router-view>
                    <!-- </keep-alive>-->
                </transition>
            </section>
        </el-col>
    </el-row>
</template>

<script>
    import util from "../util/util.js";
    //import tabView from '../components/TabView';
    // import routes from "../router/compHome"
    export default {
        //components: {tabView},
        name: "",
        data() {
            return {
                currentPath: ["首页"],
                message: {
                    webSocket: null,
                    opening: false,
                    list: [],
                    current: {},
                    dialogVisible: false,
                    notify: null,
                },
                routes: [],
            };
        },
        methods: {
            getmenu() {
                console.log('是否进入')
                let menuList = JSON.parse(JSON.parse(localStorage.getItem("routes")));
                console.log(menuList)
                let menuData = [];
                menuList.forEach((router) => {
                    menuData.push(router);
                });
                this.routes = menuData;
                //   console.log(this.routes)
            },
            handleCommand(cmd) {
                var _this = this;
                if (cmd == "logout") {
                    // this.$loading.show();
                    this.$postForLogin("login", "logout")
                        .then((res) => {
                            console.log("logout:" + res.status);
                            // this.$loading.hide();
                            if (res.status == 200) {
                                let ret = res.data;
                                if (ret.code == 200) {
                                    util.remove("token");
                                    util.remove("remember");
                                    this.$store.commit("logout");
                                    this.$router.push({
                                        name: "login",
                                        params: {},
                                    });
                                } else {
                                    _this.$message.error(ret.msg || "退出失败，网络错误");
                                }
                            } else {
                                _this.$message.error("退出失败，网络错误:" + res.status);
                            }
                        })
                        .catch((res) => {
                            // this.$loading.hide();
                        });
                }
            },
            //退出登录
            logout() {
                var _this = this;
                this.$confirm("确认退出吗?", "提示", {
                    //type: 'warning'
                })
                    .then(() => {
                        sessionStorage.removeItem("user");
                        _this.$router.push("/login");
                    })
                    .catch(() => {
                    });
            },

        },
        mounted() {
            this.getmenu();
            // console.log('this routes : ' + this.routes)
            // this.routerList = routes;
        },
        created() {
        },
        destroyed() {
        },
        computed: {
            user() {
                console.log(this.$store.state.user);
                return this.$store.state.user;
            },
            // routes() {
            //     console.log(this.$store.state.routes)
            //     return this.$store.state.routes;
            // },
            // cachedViews() {
            //     return this.$store.state.tabView.cachedViews;
            // },
            key() {
                return this.$route.fullPath;
            },
        },
    };
</script>

<style scoped>
    ::-webkit-scrollbar-track-piece {
        background-color: #f8f8f8;
    }

    ::-webkit-scrollbar {
        width: 9px;
        height: 9px;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #dddddd;
        background-clip: padding-box;
        min-height: 28px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background-color: #bbb;
    }

    .container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .main {
        display: flex;
        flex: 1;
        overflow: hidden;
    }

    .main .menu-expanded {
        width: 160px;
    }

    .menu-expanded .el-menu {
        width: 100%;
        height: 100%;
        overflow: auto;
        background: #00CCCC;
    }

    .menu-expanded .el-submenu >>> .el-submenu__title {
        color: #fff;
    }

    .menu-expanded .el-submenu >>> .el-menu--inline {
        background: transparent;
    }

    .menu-expanded .el-submenu >>> .el-menu--inline .el-menu-item {
        color: #fff;
    }

    .main >>> .el-icon-arrow-down:before {
        /* content: "";*/
    }

    .menu-expanded >>> .el-submenu__title .icon {
        color: #fff;
        position: relative;
        top: 2px;
    }

    .menu-expanded >>> .el-submenu__title:hover {
        background-color: rgba(3, 19, 33, 0.2) !important;
    }

    .menu-expanded >>> .el-menu-item .icon {
        color: #fff;
        position: relative;
        top: 2px;
    }

    .menu-expanded >>> .el-menu-item:hover {
        background-color: rgba(3, 19, 33, 0.2) !important;
    }

    .menu-expanded >>> .el-submenu__title.is-active {
        background-color: rgba(3, 19, 33, 0.2) !important;
    }

    .menu-expanded >>> .el-menu-item.is-active {
        background-color: rgba(3, 19, 33, 0.2) !important;
    }

    .menu-expanded >>> .el-menu-item.is-active .icon {
        color: #5bb3d7 !important;
    }

    /*5bb3d7*/

    .main .content-container {
        flex: 1;
        overflow: auto;
        background: #f3fffd;
    }

    .header {
        height: 50px;
        background: #00CCCC;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 2px solid #fff;
    }

    .el-menu-item,
    .el-submenu__title {
        height: 50px;
        line-height: 50px;
    }

    .el-submenu [class^="el-icon-"] {
        width: 14px;
    }

    .el-badge__content.is-fixed {
        transform: translateY(10%) translateX(100%);
        -webkit-transform: translateY(10%) translateX(100%);
    }

    .homeContent {
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    .homeContent .iconfont {
        color: #4a81ac !important;
        margin: 0 5px 0 0;
        position: relative;
        top: 3px;
    }

    .homePage {
        font-size: 14px;
        color: #fff;
    }

    .userInfo {
        text-align: right;
        padding-right: 20px;
        float: right;
        top: 10px;
    }

    .userinfo-inner {
        cursor: pointer;
        color: #fff;
    }

    .userinfo-inner img {
        width: 40px;
        height: 40px;
        border-radius: 20px;
        margin: 10px 0px 10px 10px;
        float: right;
    }

    >>> .markersItem {
        margin-left: -320px !important;
    }
</style>

