<template>
    <div>
        <el-row type="flex" justify="space-between">
            <el-col :xs="18" :sm="18" :md="18" :lg="18">
                <el-row type="flex" justify="start">
                    <el-form :inline="true" :model="queryItem">
                        <el-form-item label="IP地址">
                            <el-input v-model="queryItem.like_ip_address" placeholder="IP地址"></el-input>
                        </el-form-item>
                        <el-form-item label="用户">
                            <el-input v-model="queryItem.like_user_account" placeholder="用户"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="getList">查询</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="reset">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-row>
            </el-col>
            <el-col :xs="6" :sm="6" :md="6" :lg="6">
                <el-row type="flex" justify="end">
                    <el-button type="primary" icon="el-icon-plus" @click="addClick">新增</el-button>
                </el-row>
            </el-col>
        </el-row>
        <el-table
                :data="tableData"
        >
            <el-table-column
                    prop="userAccount"
                    label="用户"
                    min-width="180"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="ipAddress"
                    label="IP地址"
                    min-width="180"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="startTime"
                    label="开始时间"
                    min-width="180"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="endTime"
                    label="结束时间"
                    min-width="180"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="tips"
                    label="备注"
                    min-width="180"
                    align="center">
            </el-table-column>
            <el-table-column
                    label="操作"
                    align="center"
                    min-width="100">
                <template slot-scope="scope">
                    <el-button @click="editClick(scope.row)" type="text">编辑</el-button>
                    <el-button @click="removeData(scope.row)" type="text">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row type="flex" justify="end">
            <el-pagination
                    style="float: right"
                    @size-change="sizeChange"
                    @current-change="pageChange"
                    :current-page="pageData.current"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="pageData.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageData.total">
            </el-pagination>
        </el-row>
        <el-dialog :title="title" :visible.sync="editFormVisible" @close="onEditClose" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="myForm" label-position="right">
                <el-form-item label="用户" prop="userAccount">
                    <el-input v-model="editForm.userAccount" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="IP地址" prop="ipAddress">
                    <el-input v-model="editForm.ipAddress" auto-complete="off"></el-input>
                </el-form-item>
                <el-row type="flex" justify="space-between">
                    <el-form-item label="开始时间" prop="startTime">
                        <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"
                                        v-model="editForm.startTime"
                                        auto-complete="off"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="endTime">
                        <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"
                                        v-model="editForm.endTime"
                                        auto-complete="off"></el-date-picker>
                    </el-form-item>
                </el-row>
                <el-form-item label="备注" prop="tips">
                    <el-input type="textarea" resize="none" :autosize="{ minRows: 2, maxRows: 4}"
                              v-model="editForm.tips" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'blacklist',
        data() {
            let startTimeValidate = (rule, value, callback) => {
                if (!value)
                    return callback();
                if (this.editForm.startTime && this.editForm.endTime) {
                    this.$refs.myForm.validateField('endTime');
                }
                callback();
            };
            let endTimeValidate = (rule, value, callback) => {
                if (!value)
                    return callback();
                if (this.editForm.startTime && this.editForm.endTime) {
                    let start = new Date(this.editForm.startTime);
                    let end = new Date(this.editForm.endTime);
                    if (start.getTime() > end.getTime()) {
                        callback(new Error("结束时间必须大于开始时间"));
                        return;
                    }
                }
                callback();
            };
            return {
                title: '',
                row: '',
                isNew: true,
                queryItem: {
                    orderBy: 'id',
                    isAsc: false
                },
                tableData: [],
                pageData: {
                    current: 1,
                    total: 0,
                    pageSize: 10
                },
                editFormRules: {
                    userAccount: [
                        {required: true, message: '请输用户名', trigger: 'blur'}
                    ],
                    ipAddress: [
                        {required: true, message: '请输入IP地址', trigger: 'blur'},
                        {
                            pattern: /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/,
                            message: 'IP地址不合法',
                            trigger: 'blur'
                        }
                    ], startTime: [
                        {validator: startTimeValidate, trigger: 'blur'}
                    ], endTime: [
                        {validator: endTimeValidate, trigger: 'blur'}
                    ],
                    tips: [
                        {max: 255, message: '备注长度不能超过255', trigger: 'blur'}
                    ]
                },
                editForm: {
                    id: '',
                    userAccount: '',
                    ipAddress: '',
                    tips: ''
                },
                editLoading: false,
                editFormVisible: false,
            }
        }, created() {
            this.getList();
        }, methods: {
            reset() {
                this.queryItem = {
                    id: '',
                    orderBy: 'id',
                    isAsc: false
                }
            },
            getList() {
                let queryData = Object.assign({
                    pageIndex: this.pageData.current,
                    pageSize: this.pageData.pageSize
                }, this.queryItem);
                this.$post('blacklist', 'page', queryData)
                        .then((res) => {
                            this.tableData = res.data.records;
                            this.pageData.total = res.data.total * 1;
                            this.pageData.pageSize = res.data.size;
                            this.pageData.current = res.data.current;
                        });
            },
            pageChange(current) {
                this.pageData.current = current;
                this.getList();
            },
            sizeChange(size) {
                this.pageData.current = 1;
                this.pageData.pageSize = size;
                this.getList();
            },
            selectRow(row, oldRow) {
                this.row = row;
            },
            editSubmit() {
                this.$refs["myForm"].validate((valid) => {
                    if (valid) {
                        let data = Object.assign({}, this.editForm)
                        if (!data.startTime) {
                            delete data.startTime;
                        }
                        if (!data.endTime) {
                            delete data.endTime;
                        }
                        if (this.isNew) {
                            this.$post('blacklist', 'add', data)
                                    .then((res) => {
                                        this.$message({
                                            type: 'success',
                                            message: res.msg
                                        });
                                        this.pageData.current = 1;
                                        this.reset();
                                        this.getList();
                                        this.editFormVisible = false;
                                    });
                        } else {
                            this.$post('blacklist', 'update', data)
                                    .then((res) => {
                                        this.$message({
                                            type: 'success',
                                            message: res.msg
                                        });
                                        this.getList();
                                        this.editFormVisible = false;
                                    });
                        }
                    } else {
                        return false;
                    }
                });

            },
            onEditClose() {
                this.$refs['myForm'].resetFields();
            },
            addClick: function () {
                this.title = '新增';
                this.isNew = true;
                this.editForm={startTime:'',endTime:''};
                this.editFormVisible = true;
            },
            editClick: function (row) {
                this.title = '编辑';
                this.isNew = false;
                this.editForm={startTime:'',endTime:''};
                for (let x in row) {
                    this.editForm[x] = row[x] || ''
                }
                this.editFormVisible = true;
            },
            removeData(row) {
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$post('blacklist', 'delete', {ids: row.id})
                            .then((res) => {
                                this.getList();
                                this.$message({
                                    type: 'success',
                                    message: res.msg
                                });
                            });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }
    }
</script>
