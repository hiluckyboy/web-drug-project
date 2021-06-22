<template>
    <div>
        <el-table :data="tableData">
            <el-table-column
                    align="center"
                    type="index"
            >
            </el-table-column>
            <el-table-column
                    align="center"
                    label="账户"
                    prop="account"
                    min-width="60"
            ></el-table-column>
            <el-table-column
                    align="center"
                    label="姓名"
                    prop="name"
                    min-width="60"
            ></el-table-column>
            <el-table-column
                    align="center"
                    label="机构"
                    prop="orgName"
                    min-width="80"
            ></el-table-column>
            <el-table-column
                    align="center"
                    label="IP地址"
                    prop="host"
                    min-width="80"
            ></el-table-column>
            <el-table-column
                    align="center"
                    label="登录时间"
                    prop="loginTime"
                    min-width="80"
            ></el-table-column>
            <el-table-column
                    align="center"
                    label="最后访问时间"
                    prop="lastAccessTime"
                    min-width="80"
            ></el-table-column>
            <el-table-column
                    align="center"
                    label="到期时间"
                    prop="timeout"
                    min-width="80"
            ></el-table-column>
            <el-table-column
                    align="center"
                    label="操作"
                    min-width="40"
            >
                <template slot-scope="scope">
                    <el-button @click="kickout(scope.row)" type="text">下线</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row type="flex" justify="end">
            <el-pagination
                    @size-change="sizeChange"
                    @current-change="pageChange"
                    :current-page="pageData.pageIndex"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="pageData.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageData.total">
            </el-pagination>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "Online",
        data() {
            return {
                tableData: [],
                pageData: {
                    pageIndex: 1,
                    pageSize: 10,
                    total: 0
                },
                queryForm: {}
            }
        },
        methods: {
            init() {
                this.getOnline();
            },
            getOnline() {
                let data = this.queryForm;
                data = Object.assign(data, this.pageData);
                this.$post('online', 'page', data).then(res => {
                    if (res && res.code == 200) {
                        this.tableData = JSON.parse(res.data).records;
                        this.pageData.total = Number(JSON.parse(res.data).total);
                        console.log(this.pageData.total)
                    } else {
                        this.$message.error(res.msg || "查询失败");
                    }
                }).catch(res => {
                });
            },
            pageChange(page) {
                this.pageData.pageIndex = page;
                this.getOnline();
            }, sizeChange(size) {
                this.pageData.pageSize = size;
                this.getOnline();
            }
            ,
            kickout(row) {
                if (!row) {
                    this.$message.error("请选择一条记录");
                    return
                }
                this.$confirm('用户 [' + row.name + '] 将被强制下线，确认继续吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$post('online', 'kickout', {sessionId: row.sessionId}).then(res => {
                        if (res && res.code == 200) {
                            this.$message.success("操作成功");
                            this.getOnline();
                        } else {
                            this.$message.error(res.msg || "操作失败")
                        }
                    }).catch(res => {

                    });
                })

            }
        },
        created() {
            this.init();
        }
    }
</script>

<style scoped>

</style>
