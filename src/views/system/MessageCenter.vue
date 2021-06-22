<template>
    <el-row>
        <el-tabs type="border-card">
            <el-tab-pane :label="getTitle(false)">
                <el-container class="mycontainer">
                    <el-aside class="left" style="width: 350px;">
                        <div v-if="notRead.list.length>0">
                            <el-row v-bind:class="[notRead.list.length>10&i==notRead.list.length-1?'no-bottom-border':'']"
                                    @click.native="clickItem(item,false)"
                                    :id="getNotReadId(item)"
                                    v-for="(item,i) in notRead.list"
                                    :key="item.id"
                                    class="item notwrap">{{item.title}}
                            </el-row>
                        </div>
                        <div v-else class="noMsg">没有消息</div>
                    </el-aside>
                    <el-main class="right">
                        <el-row v-if="notRead.current&&notRead.current.id" style="width: 70%;margin:auto">
                            <el-row class="title">
                                {{notRead.current.title}}
                            </el-row>
                            <el-row>
                                <el-col>时间: {{notRead.current.gmtCreate}}</el-col>
                            </el-row>
                            <el-row type="flex" justify="between-space">
                                <el-col>发送人: {{notRead.current.senderName}}</el-col>
                                <el-col>接收人: {{notRead.current.receiverName}}</el-col>

                            </el-row>
                            <el-row class="content">
                                <div class="input">{{notRead.current.content}}
                                </div>
                            </el-row>
                            <el-row type="flex" style="width: 80%;" justify="end">
                                <el-button @click.native="readClick(false)" type="success">标记为已读</el-button>
                            </el-row>
                        </el-row>
                    </el-main>
                </el-container>
            </el-tab-pane>
            <el-tab-pane :label="getTitle(true)">
                <el-container class="mycontainer">
                    <el-aside class="left" style="width: 350px;">
                        <div v-if="read.list.length>0">
                            <el-row v-bind:class="[read.list.length>10&i==read.list.length-1?'no-bottom-border':'']"
                                    v-for="(it,i) in read.list"
                                    @click.native="clickItem(it,true)" :id="getReadId(it)"
                                    :key="it.id"
                                    class="item notwrap">
                                {{it.title}}
                            </el-row>
                        </div>
                        <div v-else class="noMsg">没有消息</div>
                    </el-aside>
                    <el-main class="right">

                        <el-row v-if="read.current&&read.current.id" style="width: 70%;margin:auto">
                            <el-row class="title">
                                {{this.read.current.title}}
                            </el-row>
                            <el-row>
                                <el-col>时间: {{read.current.gmtCreate}}</el-col>
                            </el-row>
                            <el-row type="flex" justify="between-space">
                                <el-col>发送人: {{read.current.senderName}}</el-col>
                                <el-col>接收人: {{read.current.receiverName}}</el-col>
                            </el-row>
                            <el-row class="content">
                                <div class="input">{{read.current.content}}
                                </div>
                            </el-row>
                            <el-row type="flex" style="width: 80%;" justify="end">
                                <el-button @click.native="deleteClick(true)" type="danger">删除</el-button>
                            </el-row>
                        </el-row>
                    </el-main>
                </el-container>
            </el-tab-pane>
        </el-tabs>
    </el-row>
</template>

<script>
    export default {
        name: "messageCenter",
        data() {
            return {
                notRead: {
                    current: {},
                    list: [],
                    element: {}
                },
                read: {
                    current: {},
                    list: [],
                    element: {}
                }
            }
        },
        methods: {
            getList() {
                this.$post('message', 'getList').then(res => {
                    if (res && res.code == 200) {
                        this.notRead.list = [];
                        this.read.list = [];
                        this.notRead.list = res.data.notRead;
                        this.notRead.current = {};
                        this.read.list = res.data.read;
                        this.read.current = {};
                    } else {
                        this.$message.error(res.msg || "查询错误");
                    }
                }).catch(res => {
                });
            },
            getTitle(readFlag) {
                if (readFlag) {
                    if (this.read.list && this.read.list.length > 0)
                        return "已读消息(" + this.read.list.length + ")";
                    return "已读消息";
                } else {
                    if (this.notRead.list && this.notRead.list.length > 0)
                        return "未读消息(" + this.notRead.list.length + ")";
                    return "未读消息";
                }
            },
            clickItem(msg, readFlag) {
                let domId = null;
                let list = [];
                if (readFlag) {
                    list = this.read.list;
                    this.read.current = msg;
                } else {
                    list = this.notRead.list;
                    this.notRead.current = msg;
                }
                for (let i in list) {
                    if (readFlag)
                        domId = this.getReadId(list[i]);
                    else
                        domId = this.getNotReadId(list[i]);
                    let dom = document.getElementById(domId);
                    if (list[i].id == msg.id) {
                        this.addClass('active', [dom]);
                    } else {
                        this.removeClass('active', [dom]);
                    }
                }

            },
            getNotReadId(msg) {
                return "msg_notread_" + msg.id;
            },
            getReadId(msg) {
                return "msg_read_" + msg.id;
            },
            deleteClick(readFlag) {
                let msg = null;
                if (readFlag) {
                    msg = this.read.current;
                } else {
                    msg = this.notRead.current;
                }
                if (!msg || !msg.id) {
                    this.$message.error("请选择一条记录");
                    return;
                }
                this.$post('message', 'delete', {id: msg.id}).then(res => {
                    if (res && res.code == 200) {
                        this.$message.success("操作成功");
                        this.getList();
                        this.$emit('messageChange');
                    } else {
                        this.$message.error(res.msg || "操作失败");
                    }
                }).catch(res => {

                })
            },
            readClick(readFlag) {
                let msg = null;
                if (readFlag) {
                    msg = this.read.current;
                    this.getList();
                } else {
                    msg = this.notRead.current;
                }
                if (!msg || !msg.id) {
                    this.$message.error("请选择一条记录");
                    return;
                }
                this.$post('message', 'read', {id: msg.id}).then(res => {
                    if (res && res.code == 200) {
                        this.$message.success("操作成功");
                        this.getList();
                        this.$emit('messageChange');
                    } else {
                        this.$message.error(res.msg || "操作失败");
                    }
                }).catch(res => {
                })
            },
            addClass(kls, dom) {
                let klsReg = new RegExp(kls, 'ig');
                for (let i = 0; i < dom.length; i++) {
                    let node = dom[i];
                    let klses = node.className;
                    if (!klsReg.test(klses)) {
                        node.className = klses + ' ' + kls
                    }
                }
            },
            removeClass(kls, dom) {
                let klsReg = new RegExp(kls, 'ig');
                for (let i = 0; i < dom.length; i++) {
                    let node = dom[i];
                    let klses = node.className;
                    if (klsReg.test(klses)) {
                        node.className = node.className.replace(kls, '')
                    }
                }
            }
        },
        created() {
            this.getList();
        },
        computed: {},
        watch: {}

    }
</script>

<style scoped>

    .no-bottom-border {
        border-bottom: 0 !important;
    }

    .mycontainer {
        height: 450px;
    }

    .mycontainer ::-webkit-scrollbar-track-piece {
        background-color: #fff;
    }

    .left .item :hover {
        color: #4FC3BA;
    }

    .left .item {
        border: 1px solid #e4e7ed;
        border-bottom: 0;
        border-left: 0;
        height: 50px;
        text-align: left;
        line-height: 50px;
        margin: 0px;
        padding-left: 10px;
        color: #909399;
        cursor: pointer;
    }

    .left .active {
        border-right-color: #fff;
        background-color: #fff;
        color: #4FC3BA;
    }

    .left .item:last-child {
        border-bottom: 1px solid #e4e7ed;
    }

    .left .item:first-child {
        border-top: 0;
    }

    .left {
        background-color: #f5f7fa;
        margin-left: 10px;
        border-bottom: 1px solid #e4e7ed;
        border-left: 1px solid #e4e7ed;
        border-top: 1px solid #e4e7ed;
    }

    .right {
        border: 1px solid #e4e7ed;
        border-left: none;
    }

    .right .title {
        font-size: 25px;
        font-weight: bold;
        height: 30px;
        line-height: 30px;
    }

    .right .content {
        width: 80%;
    }

    .right .content .input {
        border: 1px solid #e4e7ed;
        padding: 5px;
        width: 100%;
        height: 200px;
        border-radius: 2%;
    }

    .noMsg {
        text-align: center;
        margin-top: 10px;
        color: #909399;
    }
</style>
