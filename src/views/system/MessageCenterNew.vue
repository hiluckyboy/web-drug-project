<template>
    <div>
        <el-tabs>
            <el-tab-pane>
                <span slot="label">{{notRead.title}}</span>
                <el-row type="flex" justify="end" style="margin-bottom: 5px">
                    <el-button @click.native="readClick(false)" :disabled="notRead.selected.length<=0" type="primary"
                               size="mini">标记为已读<span
                            v-show="notRead.selected.length>0">({{notRead.selected.length}})</span></el-button>
                    <el-button type="primary" @click.native="readAll" size="mini">全部标记为已读</el-button>
                </el-row>
                <div>
                    <el-table ref="notReadTable"
                              :data="notRead.list"
                              header-row-class-name="head"
                              row-key="id"
                              @select="notReadSelect"
                              @select-all="notReadSelect"
                    >
                        <el-table-column
                                type="selection"
                        >
                        </el-table-column>

                        <el-table-column
                                prop="title"
                                label="标题"
                                :min-width="80"
                                align="center"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="senderName"
                                label="发送人"
                                :min-width="80"
                                align="center"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="content"
                                label="内容"
                                :min-width="200"
                                align="center"
                                :show-overflow-tooltip="true"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="gmtCreate"
                                label="时间"
                                align="center"
                                :min-width="80"
                        >
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                align="center"
                                :min-width="40"
                        >
                            <template slot-scope="scope">
                                <el-button @click.native="show(scope.row,false)" type="text">查看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                            style="float: right"
                            @size-change="notReadSizeChange"
                            @current-change="notReadPageChange"
                            :current-page="notRead.pageData.pageIndex"
                            :page-sizes="[10, 20, 30, 50]"
                            :page-size="notRead.pageData.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            size="small"
                            :total="notRead.pageData.total">
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane>
                <span slot="label">{{read.title}}</span>
                <el-row type="flex" justify="end" style="margin-bottom: 5px">
                    <el-button @click.native="deleteClick(false)" :disabled="read.selected.length<=0" type="danger"
                               size="mini">删除<span
                            v-show="read.selected.length>0">({{read.selected.length}})</span></el-button>
                    <el-button @click.native="delAll" type="danger" size="mini">全部删除</el-button>
                </el-row>
                <div>
                    <el-table ref="readTable"
                              :data="read.list"
                              header-row-class-name="head"
                              row-key="id"
                              @select="readSelect"
                              @select-all="readSelect"
                    >
                        <el-table-column
                                type="selection"
                        >
                        </el-table-column>

                        <el-table-column
                                prop="title"
                                label="标题"
                                :min-width="80"
                                align="center"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="senderName"
                                label="发送人"
                                :min-width="80"
                                align="center"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="content"
                                label="内容"
                                :min-width="200"
                                align="center"
                                :show-overflow-tooltip="true"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="gmtCreate"
                                label="时间"
                                align="center"
                                :min-width="80"
                        >
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                align="center"
                                :min-width="40"
                        >
                            <template slot-scope="scope">
                                <el-button @click.native="show(scope.row,true)" type="text">查看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                            style="float: right"
                            @size-change="readSizeChange"
                            @current-change="readPageChange"
                            :current-page="read.pageData.pageIndex"
                            :page-sizes="[10, 20, 30, 50]"
                            :page-size="read.pageData.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            size="small"
                            :total="read.pageData.total">
                    </el-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>
        <el-dialog title="查看" :visible.sync="dialogShow" :close-on-click-modal="false" @close="dialogClose">
            <el-form style="margin:auto;width:80%;" label-width="80px">
                <el-row>
                    <el-form-item size="mini" label="标题">
                        <el-input label="标题" v-model="dialogRow.title" readonly></el-input>
                    </el-form-item>
                </el-row>
                <el-row type="flex" justify="between-space">
                    <el-form-item size="mini" label="发送人">
                        <el-input label="发送人" v-model="dialogRow.senderName" readonly></el-input>
                    </el-form-item>
                    <el-form-item size="mini" label="时间">
                        <el-input label="时间" v-model="dialogRow.gmtCreate" readonly></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item size="mini" label="内容">
                        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10}" resize="none" readonly
                                  v-model="dialogRow.content"></el-input>
                    </el-form-item>
                </el-row>
            </el-form>
            <div slot="footer">
                <el-button size="mini" @click.native="dialogShow = false">取消</el-button>
                <el-button v-show="!dialogFlag" size="mini" type="primary" @click.native="readClick(true)"
                           >我知道了
                </el-button>
                <el-button v-show="dialogFlag" size="mini" type="danger" @click.native="deleteClick(true)"
                           >删除
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "MessageCenterNew",
        data() {
            return {
                dialogShow: false,
                dialogRow: {},
                dialogFlag: {},
                notRead: {
                    current: {},
                    list: [],
                    element: {},
                    pageData: {
                        pageIndex: 1,
                        pageSize: 10,
                        total: 0
                    },
                    selected: [],
                    title: "未读消息"
                },
                read: {
                    current: {},
                    list: [],
                    element: {},
                    pageData: {
                        pageIndex: 1,
                        pageSize: 10,
                        total: 0
                    },
                    selected: [],
                    title: "已读消息"
                }
            }
        },
        methods: {
            getNotReadList() {
                let pageData = this.notRead.pageData;
                this.$post('message', 'getNotReadList', pageData).then(res => {
                    if (res && res.code == 200) {
                        this.notRead.list = res.data.records;
                        this.notRead.pageData.total = Number(res.data.total);
                        this.$nextTick(function () {
                            this.notRead.current = {};
                            this.$refs.notReadTable.clearSelection();
                            this.notRead.selected = [];
                        });
                    } else {
                        this.$message.error(res.msg || "查询错误");
                    }
                }).catch(res => {
                });
            }, getReadList() {
                let pageData = this.read.pageData;
                this.$post('message', 'getReadList', pageData).then(res => {
                    if (res && res.code == 200) {
                        this.read.list = res.data.records;
                        this.read.pageData.total = Number(res.data.total);
                        this.read.current = {};
                        this.$nextTick(function () {
                            this.read.current = {};
                            this.$refs.readTable.clearSelection();
                            this.read.selected = [];
                        });
                    } else {
                        this.$message.error(res.msg || "查询错误");
                    }
                }).catch(res => {
                });
            },
            getNotReadId(msg) {
                return "msg_notread_" + msg.id;
            },
            getReadId(msg) {
                return "msg_read_" + msg.id;
            },
            deleteClick(currentFlag) {
                let ids = [];
                if (currentFlag) {
                    ids.push(this.read.current.id);
                } else {
                    for (let i in this.read.selected) {
                        ids.push(this.read.selected[i].id);
                    }
                }
                if (ids.length <= 0) {
                    this.$message.error("请选择一条记录");
                    return;
                }
                this.$confirm('确认要删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$post('message', 'delete', {ids: ids.join(',')}).then(res => {
                        if (res && res.code == 200) {
                            this.$message.success("操作成功");
                            this.init();
                            this.dialogShow = false;
                            this.$emit('messageChange');
                        } else {
                            this.$message.error(res.msg || "操作失败");
                        }
                    }).catch(res => {

                    })
                });
            },
            readClick(currentFlag) {
                let ids = [];
                if (currentFlag) {
                    ids.push(this.notRead.current.id);
                } else {
                    for (let i in this.notRead.selected) {
                        ids.push(this.notRead.selected[i].id);
                    }
                }
                if (ids.length <= 0) {
                    this.$message.error("请选择一条记录");
                    return;
                }
                console.log(ids.join(','));
                this.$confirm('确认要标记为已读吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$post('message', 'read', {ids: ids.join(',')}).then(res => {
                        if (res && res.code == 200) {
                            this.$message.success("操作成功");
                            this.init();
                            this.dialogShow = false;
                            this.$emit('messageChange');
                        } else {
                            this.$message.error(res.msg || "操作失败");
                        }
                    }).catch(res => {
                    })
                });
            },
            readAll() {
                this.$confirm('确认要将所有未读消息标记为已读吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$post('message', 'readAll').then(res => {
                        if (res && res.code == 200) {
                            this.$message.success("操作成功");
                            this.init();
                            this.$emit('messageChange');
                        } else {
                            this.$message.error(res.msg || "操作失败");
                        }
                    }).catch(res => {
                    });

                });
            },
            delAll() {
                this.$confirm('确认要将所有已读消息删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$post('message', 'deleteAll').then(res => {
                        if (res && res.code == 200) {
                            this.$message.success("操作成功");
                            this.init();
                            this.$emit('messageChange');
                        } else {
                            this.$message.error(res.msg || "操作失败");
                        }
                    }).catch(res => {

                    });
                });
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
            },
            notReadSizeChange(size) {
                this.notRead.pageData.pageSize = size;
                this.getReadList();
            },
            notReadPageChange(page) {
                this.notRead.pageData.pageIndex = page;
                this.getNotReadList();
            },
            readSizeChange(size) {
                this.read.pageData.pageSize = size;
                this.getReadList();
            },
            readPageChange(page) {
                this.read.pageData.pageIndex = page;
                this.getReadList();
            },
            notReadSelect(selection) {
                this.notRead.selected = [...selection];
            },
            readSelect(selection) {
                this.read.selected = [...selection];
            },
            show(row, readFlag) {
                if (readFlag) {
                    this.read.current = row;
                } else {
                    this.notRead.current = row;
                }
                this.dialogFlag = readFlag;
                this.dialogRow = row;
                this.dialogShow = true;
            },
            dialogClose() {
                this.dialogRow = {};
            },
            init() {
                this.getNotReadList();
                this.getReadList();
            }
        },
        created() {
            this.init();
        },
        computed: {
            notReadTotal() {
                return this.notRead.pageData.total;
            },
            readTotal() {
                return this.read.pageData.total;
            }
        },
        watch: {
            notReadTotal(newValue) {
                if (newValue && newValue > 0)
                    this.notRead.title = "未读消息(" + newValue + ")";
                else if (newValue > 99)
                    this.notRead.title = "未读消息(99+)";
                else
                    this.notRead.title = "未读消息";
            },
            readTotal(newValue) {
                if (newValue && newValue > 0)
                    this.read.title = "已读消息(" + newValue + ")";
                else if (newValue > 99)
                    this.read.title = "已读消息(99+)";
                else
                    this.read.title = "已读消息";
            }
        }

    }
</script>

<style scoped>
    .head {
        background-color: #5e7382;
        height: 50px;
        line-height: 50px;
        margin: 0;
    }

    .head .item {
        text-align: left;
        border-bottom: 1px solid yellow;
        padding-left: 5px;
    }

    .row {
        height: 40px;
        border-bottom: 1px solid blue;
        line-height: 40px;
        background-color: #999999;
        margin: 0;
    }

    .row .item {
        padding-left: 5px;
    }

    .row .time {
        text-align: center;
        padding-left: 0;
    }

    .head .time {
        text-align: center;
        padding-left: 0;
    }


</style>
