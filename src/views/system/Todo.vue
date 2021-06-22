<template>
    <el-row justify="space-between">
        <el-form label-width="80px">
            <el-col :xs="20" :sm="20" :md="20" :lg="20">
                <el-row type="flex" justify="space-between">
                    <el-col>
                        <el-form-item label="标题">
                            <el-input size="mini" placeholder="标题" v-model="queryForm.title"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item label="发送人">
                            <el-input size="mini" placeholder="发送人" v-model="queryForm.sender"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item label="接收人">
                            <el-input size="mini" placeholder="接收人" v-model="queryForm.receiver"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="space-between">
                    <el-col>
                        <el-form-item label="状态">
                            <el-select value-key="num" size="mini" placeholder="状态" v-model="queryForm.status">
                                <el-option
                                        v-for="item in state"
                                        :key="item.num"
                                        :label="item.name"
                                        :value="item.num"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item label="发送时间">
                            <el-date-picker size="mini" type="datetimerange"
                                            range-separator="至"
                                            start-placeholder="开始时间"
                                            end-placeholder="结束时间"
                                            v-model="queryForm.time"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <div id="el-form-item__content">
                            <el-button type="primary" icon="el-icon-search" size="mini" @click.native="getList">查询
                            </el-button>
                            <el-button type="primary" icon="el-icon-refresh" size="mini" @click.native="resetQuery">重置
                            </el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
        </el-form>
        <div style="clear: both"></div>
        <el-row type="flex" justify="end" style="margin-bottom: 5px">
            <el-button @click.native="addClick" icon="el-icon-plus" size="mini" type="primary">新增</el-button>
        </el-row>
        <el-table row-key="id"
                  :data="tableData"
                  highlight-current-row
        >
            <el-table-column
                    prop="title"
                    label="标题"
                    width="180"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="content"
                    label="内容"
                    width="180"
                    show-overflow-tooltip
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="senderName"
                    label="发送人"
                    min-width="100"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="receiverName"
                    label="接收人"
                    min-width="100"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="gmtCreate"
                    label="发送时间"
                    width="180"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="状态"
                    min-width="60"
                    align="center">
                <template slot-scope="scope">
                    <el-tag
                            :type="getType(scope.row.status)"
                            disable-transitions>{{formatterStatus(scope.row.status)}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="操作"
                    min-width="60"
                    align="center">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.status!=1" @click.native="deleteClick(scope.row)" type="text">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row type="flex" justify="end">
            <el-pagination
                    style="float: right"
                    @size-change="sizeChange"
                    @current-change="pageChange"
                    :current-page="pageData.pageIndex"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="pageData.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    size="small"
                    :total="pageData.total">
            </el-pagination>
        </el-row>
        <el-dialog :title="dialogTitle" :visible.sync="editFormVisible" @close="onEditClose"
                   :close-on-click-modal="false">
            <el-form style="width: 80%;margin:auto" :model="form" label-width="80px" :rules="formRules"
                     ref="myForm"
                     label-position="right">
                <el-row>
                    <el-form-item label="标题" prop="title">
                        <el-input placeholder="请输入标题" v-model="form.title" auto-complete="off"></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="接收人" prop="receivers">
                        <el-tag :key="tag.id" style="margin-right: 3px;"
                                v-for="tag in form.receivers"
                                closable size="small"
                                :disable-transitions="false"
                                @close="onTagClose(tag)">
                            {{tag.name}}
                        </el-tag>
                        <el-button size="mini" @click="showSelectUserDialog">选择用户</el-button>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="内容" prop="content">
                        <el-input placeholder="请输入内容" type="textarea" :autosize="{ minRows: 5, maxRows: 10 }"
                                  v-model="form.content"
                                  auto-complete="off"></el-input>
                    </el-form-item>
                </el-row>
            </el-form>
            <div slot="footer">
                <el-button size="mini" @click.native="editFormVisible = false">取消</el-button>
                <el-button size="mini" type="primary" @click.native="handleSubmit">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog title="选择用户" :visible.sync="selectUserVisible" @close="onSelectUserClose"
                   :close-on-click-modal="false">
            <el-row>
                <el-form :inline="true" label-width="40px">
                    <el-form-item label="姓名">
                        <el-input placeholder="姓名" :clearable="true" label="姓名"
                                  v-model="dialogQuery.queryForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="机构">
                        <el-cascader placeholder="机构" :clearable="true" :change-on-select="true"
                                     :filterable="true"
                                     :show-all-levels="false"
                                     :options="dialogQuery.treeData"
                                     :props="dialogQuery.treeConfig"
                                     label="机构"
                                     v-model="dialogQuery.queryForm.org"
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click.native="getUser" size="mini" type="primary">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-table @select="selUser" @select-all="selAllUser" row-key="id" ref="userTable"
                      :data="dialogQuery.tableData">
                <el-table-column
                        type="selection"
                        align="center"
                ></el-table-column>
                <el-table-column
                        label="姓名"
                        align="center"
                        prop="name"
                ></el-table-column>
                <el-table-column
                        label="机构"
                        prop="orgName"
                        align="center"
                ></el-table-column>
            </el-table>
            <el-row type="flex" justify="end">
                <el-pagination
                        style="float: right"
                        @size-change="querySizeChange"
                        @current-change="queryPageChange"
                        :current-page="dialogQuery.pageData.pageIndex"
                        :page-sizes="[10, 20]"
                        :page-size="dialogQuery.pageData.pageSize"
                        layout="total,  prev, pager, next, jumper"
                        :total="dialogQuery.pageData.total">
                </el-pagination>
            </el-row>
            <div slot="footer">
                <el-button size="mini" @click.native="selectUserVisible = false">取消</el-button>
                <el-button size="mini" type="primary" @click.native="selectUser">确定</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>

<script>
    import treeUtil from "../../util/treeUtil";

    export default {
        name: "Todo",
        data() {
            let receiversValidate = (rule, value, callback) => {
                if (value && value.length > 0) {
                    callback();
                } else {
                    callback(new Error("请选择接收人"));
                }
            }
            return {
                queryForm: {},
                form: {
                    receivers: []
                },
                formRules: {
                    receivers: [
                        {validator: receiversValidate},
                        {required: true, message: '接收人不能为空'}
                    ],
                    title: [
                        {required: true, message: '标题不能为空', trigger: 'blur'},
                        {max: 50, message: '标题长度不能超过50', trigger: 'blur'}
                    ],
                    content: [
                        {required: true, message: '请输入内容', trigger: 'blur'},
                        {max: 500, message: '内容长度不能超过500', trigger: 'blur'}
                    ]
                },
                tableData: [],
                pageData: {
                    pageIndex: 1,
                    pageSize: 10,
                    total: 0
                },
                dialogTitle: '编辑',
                editFormVisible: false,
                selectUserVisible: false,
                dialogQuery: {
                    queryForm: {name: '', org: []},
                    pageData: {pageIndex: 1, pageSize: 10, total: 0},
                    tableData: [],
                    treeData: [],
                    treeConfig: {label: 'fullName', value: 'id', children: 'children'},
                    selectedUser: [],
                    currentSelectedUser: []
                },
                state: [{num: 1, name: "未读"},
                    {num: 2, name: "已读"}]
            }
        },
        methods: {
            getList() {
                let data = this.queryForm;
                data = Object.assign(data, this.pageData);
                if (data.time) {
                    data.startTime = data.time[0];
                    data.endTime = data.time[1];
                }
                this.$post('todo', 'page', data).then(res => {
                    if (res && res.code == 200) {
                        this.tableData = JSON.parse(res.data).page.records;
                        this.pageData.total = Number(JSON.parse(res.data).page.total);
                        this.dialogQuery.currentSelectedUser = [];
                    } else {
                        this.$message.error(res.msg || "查询信息失败");
                    }
                }).catch(res => {
                });
            },
            getUser() {
                let queryForm = this.dialogQuery.queryForm;
                if (queryForm.org && queryForm.org.length > 0) {
                    let org = queryForm.org
                    queryForm.orgId = org[org.length - 1];
                } else {
                    queryForm.orgId = '';
                }
                let queryParams = Object.assign(queryForm, this.dialogQuery.pageData);
                this.$post('todo', 'getUser', queryParams).then(res => {
                    if (res && res.code == 200) {
                        this.dialogQuery.tableData = JSON.parse(res.data).records;
                        this.dialogQuery.pageData.total = Number(JSON.parse(res.data).total);
                        this.$nextTick(function () {
                            this.showSelectedUserInTable();
                        });
                        this.dialogQuery.currentSelectedUser = [];
                    } else {
                        this.$message.error(res.msg || "查询用户失败");
                    }
                }).catch((res => {

                }));
            },
            getOrg() {
                this.$post('todo', 'getOrg').then(res => {
                    if (res && res.code == 200) {
                        let id = JSON.parse(res.data).pid;
                        let tree = treeUtil.buildTreeNodeByParent(JSON.parse(res.data).list, {rootPid: id || 0});
                        this.dialogQuery.treeData = tree;
                    } else {
                        this.$message.error(res.msg || "查询用户失败");
                    }
                }).catch((res => {

                }));
            }, resetQuery() {
                this.queryForm = {};
            },
            handleSubmit() {
                this.$refs.myForm.validate((res) => {
                    if (res) {
                        let receviers = this.form.receivers;
                        let data = [];
                        let form = this.form;
                        delete form.receivers;
                        for (let i in receviers) {
                            let temp = Object.assign({}, form);
                            temp.receiverId = receviers[i].id;
                            temp.receiverName = receviers[i].name;
                            temp.orgId = receviers[i].org_id;
                            data.push(temp);
                        }
                        this.$post('todo', 'add', {entity: JSON.stringify(data)}).then(res => {
                            if (res && res.code == 200) {
                                this.$message.success("操作成功");
                                this.editFormVisible = false;
                                this.queryForm = {};
                                this.pageData = {pageIndex: 1, pageSize: 10};
                                this.getList();
                            } else {
                                this.$message.error(res.msg || "操作失败")
                            }
                        }).catch(res => {

                        });
                    }
                });
            },
            deleteClick(row) {
                if (!row) {
                    this.$message({
                        type: 'error',
                        message: '请先选中一条记录'
                    });
                    return;
                }
                if (row.status == 1) {
                    this.$message({
                        type: 'error',
                        message: '未读的记录不能删除'
                    });
                    return;
                }

                this.$confirm('确认要删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then((ret) => {
                    let loading = this.$loading({fullscreen: true});
                    this.$post('todo', 'delete', {ids: row.id}).then(res => {
                        loading.close();
                        if (res && res.code == 200) {
                            this.$message.success("操作成功！");
                            this.getList();
                        } else {
                            this.$message.error(res.msg || "操作失败");
                        }
                    }).catch(res => {
                        loading.close();
                    });
                })
            },
            addClick() {
                this.dialogTitle = '新增';
                this.editFormVisible = true;
            },
            onEditClose() {
                this.form = {};
                this.form.receivers = [];
                this.$refs.myForm.clearValidate();
            }
            ,
            sizeChange(size) {
                this.pageData.pageSize = size;
                this.getList();
            }
            ,
            pageChange(page) {
                this.pageData.pageIndex = page;
                this.getList();
            },
            querySizeChange(size) {
                this.dialogQuery.pageData.pageSize = page;
                this.getUser();
            },
            queryPageChange(page) {
                this.dialogQuery.pageData.pageIndex = page;
                this.getUser();
            },
            showSelectUserDialog() {
                this.selectUserVisible = true;
                this.$nextTick(function () {
                    this.showSelectedUserInTable();
                });
            }
            ,
            selectUser() {
                this.selectUserVisible = false;
            },
            onSelectUserClose() {
                this.$refs.userTable;
            },
            onTagClose(receiver) {
                for (let i in this.form.receivers) {
                    if (this.form.receivers[i].id == receiver.id) {
                        this.form.receivers.splice(i, 1);
                    }
                }
                this.dialogQuery.selectedUser = this.form.receivers;
            }
            ,
            orgUserTreeFilter(val, data, node) {
                if (!val)
                    return true;
                if (!data.isUser) {
                    return false;
                }
                return data.name.indexOf(val) >= 0;
            }
            ,
            getType(status) {
                if (status == 1)
                    return "danger";
                if (status == 2)
                    return "primary";
                return "success";
            },
            formatterStatus(status) {
                for (let i in this.state) {
                    if (this.state[i].num == status)
                        return this.state[i].name;
                }
            },
            selUser(selection, row) {
                this.onUserSelected([...selection]);
            },
            selAllUser(selection) {
                this.onUserSelected([...selection]);
            },
            onUserSelected(newValue) {
                let oldValue = [...this.dialogQuery.currentSelectedUser];
                let receive = [...this.form.receivers];
                if (oldValue.length > newValue.length) {
                    let delValue = [];
                    for (let i in oldValue) {
                        let flag = newValue.some(row => {
                            return row.id == oldValue[i].id;
                        });
                        if (!flag) {
                            delValue.push(oldValue[i]);
                        }
                    }
                    for (let i in receive) {
                        let flag = delValue.some(row => {
                            return row.id == receive[i].id;
                        });
                        if (flag) {
                            receive.splice(i, 1);
                        }
                    }
                } else {
                    let addValue = [];
                    for (let i in newValue) {
                        let flag = oldValue.some(row => {
                            return row.id == newValue[i].id;
                        });
                        if (!flag) {
                            addValue.push(newValue[i]);
                        }
                    }
                    for (let i in addValue) {
                        let flag = receive.some(row => {
                            return row.id == addValue[i].id;
                        });
                        if (!flag) {
                            receive.push(addValue[i]);
                        }
                    }
                }
                this.form.receivers = receive;
                this.dialogQuery.currentSelectedUser = newValue;
            },
            showSelectedUserInTable() {
                let receive = this.form.receivers;
                let tableData = this.dialogQuery.tableData;
                if(this.$refs.userTable){
                    this.$refs.userTable.clearSelection();
                    if (receive && receive.length > 0 ) {
                        for (let i in receive) {
                            for (let j in tableData)
                                if (receive[i].id == tableData[j].id)
                                    this.$refs.userTable.toggleRowSelection(tableData[j], true);
                        }
                    }
                }
            },
            init() {
                this.getList();
                this.getUser();
                this.getOrg();
            }
        },
        created() {
            this.init();
        },
        watch: {},
        computed: {
            user() {
                return this.$store.state.user;
            }
        }
    }
</script>

<style scoped>
    .user-tag {
        margin-right: 5px;
    }

    #el-form-item__content {
        line-height: 40px;

        float: right;
    }
</style>
