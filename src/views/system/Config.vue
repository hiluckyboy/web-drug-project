<template>
    <div>
        <el-row type="flex" justify="space-between">
            <el-col :xs="18" :sm="18" :md="18" :lg="18">
                <el-row type="flex" justify="start">
                    <el-form :inline="true" :model="queryItem">
                            <el-form-item label="标签">
                                <el-input v-model="queryItem.label" size="mini" placeholder="标签"></el-input>
                            </el-form-item>
                            <el-form-item label="键">
                                <el-input v-model="queryItem.configKey" size="mini"  placeholder="键"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="mini" @click="getList">查询</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="mini" @click="reset">重置</el-button>
                            </el-form-item>
                    </el-form>
                </el-row>
            </el-col>
        </el-row>
            <!--<el-col :xs="6" :sm="6" :md="6" :lg="6">-->
         <el-row type="flex" justify="end" style="margin-bottom: 5px">
                    <el-button  type="primary" size="mini" icon="el-icon-plus" @click="addClick">新增</el-button>
          </el-row>
            <!--</el-col>-->

        <el-table
                :data="tableData"
                @current-change="selectRow"
        >
            <el-table-column
                    prop="label"
                    label="标签"
                    width="180"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="configKey"
                    label="键"
                    width="180"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="configValue"
                    label="值"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="tips"
                    label="备注"
                    width="180"
                    align="center">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="100"
                    align="center">
                <template slot-scope="scope">
                    <el-button @click="editClick(scope.row)" type="text" >编辑</el-button>
                    <el-button @click="removeData(scope.row)" type="text" >删除</el-button>
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
                <el-form-item label="标签" prop="label">
                    <el-input v-model="editForm.label" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="键" prop="configKey">
                    <el-input v-model="editForm.configKey" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="值" prop="configValue">
                    <el-input v-model="editForm.configValue" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="tips">
                    <el-input v-model="editForm.tips" auto-complete="off"></el-input>
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
        data() {
            return {
                title:'',
                row:'',
                isNew:true,
                queryItem:{
                    label:'',
                    configKey:'',
                    orderBy:'',
                    isAsc:''
                },
                tableData: [],
                pageData: {
                    current: 1,
                    total: 0,
                    pageSize: 10
                },
                editFormRules: {
                    configKey: [
                        { required: true, message: '请输入配置键', trigger: 'blur' }
                    ],
                    configValue: [
                        { required: true, message: '请输入配置值', trigger: 'blur' }
                    ]
                },
                editForm: {
                    id: '',
                    label:'',
                    configKey:'',
                    configValue:'',
                    tips:''
                },
                editLoading: false,
                editFormVisible:false,
            }
        },created () {
            this.getList();
        },methods: {
            reset(){
                this.queryItem={
                    label:'',
                    configKey:'',
                    orderBy:'',
                    isAsc:''
                }
            },
            getList () {
                this.$post('config', 'page', {
                    pageIndex:this.pageData.current,
                    pageSize:this.pageData.pageSize,
                    like_label:this.queryItem.label,
                    like_config_key:this.queryItem.configKey,
                    orderBy:this.queryItem.orderBy,
                    isAsc:this.queryItem.isAsc
                })
                    .then((res) => {
                        console.log(JSON.parse(res.data).records)
                        this.tableData = JSON.parse(res.data).records;
                        console.log(JSON.parse(res.data).total*1)
                        this.pageData.total = JSON.parse(res.data).total*1;
                        console.log(JSON.parse(res.data).size)
                        this.pageData.pageSize = JSON.parse(res.data).size;
                        console.log(JSON.parse(res.data).current)
                        this.pageData.current = JSON.parse(res.data).current;
                    });
            },
            pageChange(current){
                this.pageData.current = current;
                this.getList();
            },
            sizeChange(size){
                this.pageData.current = 1;
                this.pageData.pageSize = size;
                this.getList();
            },
            selectRow(row, oldRow){
                this.row = row;
            },
            editSubmit(){
                this.$refs["myForm"].validate((valid) => {
                    if (valid) {
                        if(this.isNew){
                            this.$post('config','add',this.editForm)
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
                        }else{
                            this.$post('config','update',this.editForm)
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
            onEditClose(){
                this.$refs['myForm'].resetFields();
            },
            addClick:function() {
                this.title='新增';
                this.isNew = true;
                for(let x in this.editForm){
                    this.editForm[x] = '';
                }
                this.editFormVisible = true;
            },
            editClick:function(row) {
                this.title='编辑';
                this.isNew = false;
                for(var x in this.editForm){
                    this.editForm[x] = row[x]||''
                }
                this.editFormVisible = true;
            },
            removeData (row){
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$post('config','delete',{ids:row.id})
                        .then((res) =>{
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
