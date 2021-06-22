<template>
    <el-container>
        <el-header>影响驾驶能力药物查询系统</el-header>
        <el-container>
            <el-aside width="200px">
                <el-menu
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                    @open="handleOpen"
                    @close="handleClose"
                >
                    <el-menu-item
                        :index="index+''"
                        :key="index"
                        v-for="(item,index) in navList"
                        @click="goLink(item)"
                    >
<!--                        <i class="el-icon-menu"></i>-->
                        <span slot="title">{{item.title}}</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-container>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>
<script>
    export default {
        name: "system",
        data(){
            return {
                navList:[
                    {"title":"影响驾驶能力药物查询","url":"/system/query"},
                    {"title":"药物相互作用影响驾驶能力查询","url":"/system/queryXh"},
                    // {"title":"药物维护","url":"/system/uphold"},
                ]
            }
        },
        methods:{
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            goLink(item){
                this.$router.push({
                    path:item.url
                })
            }
        }
    }
</script>
<style scoped>
    .el-menu{
        height:100%;
    }
    .el-container {
        height: 100%;
    }
    .el-header {
        background-color: #B3C0D1;
        color: #333;
        text-align: left;
        line-height: 60px;
        font-size:30px;
        font-weight:bold;
        color: #000;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        overflow-y: scroll;
    }
    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: left;
        line-height: 200px;
        width: 300px !important;
    }
    >>> .title{
        line-height: 60px;
        font-size:28px;
    }
    >>> .el-input__inner,>>> .el-input, >>> .el-form-item__content{
        width:100%;
    }
    >>> .error{
        color: #ff0000;
    }
    >>> .warning{
        color: #ffff00;
    }
    >>> .box-card{
        width:50%;
        margin: 0 auto;
    }

    >>> .text {
        font-size: 14px;
        text-align: left;
        cursor: pointer;
    }
    >>> .item, >>> .el-row {
        padding: 10px 0;
    }

</style>
