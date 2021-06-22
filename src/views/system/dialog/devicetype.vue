<template>
    <div class="devicetype">
        <div class="containerWrap">
            <div class="closeBtn" @click="handleCloseDialog" title="关闭"></div>
            <div class="searchWrap">
                <el-form :inline="true" label-width="75px">
                    <el-form-item label="设备类型">
                        <el-input size="mini" class="filter-item" placeholder="请输入设备类型" v-model="queryItem.name"> </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="mini" icon="el-icon-search" @click="handlerQuery" style="width: 90px;height: 30px">查询</el-button>
                        <el-button type="primary" size="mini" icon="el-icon-refresh" @click="handlerReset" style="width: 90px;height: 30px">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table_box">
                <div class="searchFrom">
                    <span class="rightSpan">
                        <el-button type="primary" size="mini" icon="el-icon-plus" @click="handlerAdd" style="width: 90px;height: 30px;">新增</el-button>
                    </span>
                </div>
                <el-table
                    :data="tableData"
                    height="calc(100% - 90px)"
                    v-loading="listLoading"
                    style="width: 100%"
                >
                    <!--表格主体-->
                    <el-table-column
                            label=" "
                            type="index"
                            width="50"
                    >
                    </el-table-column>
                    <el-table-column
                            label="类型名称"
                            prop="name"
                            align="center"
                    >
                    </el-table-column>
                    <el-table-column
                            label="类型编码"
                            prop="code"
                            align="center"
                    >
                    </el-table-column>
                    <el-table-column label="操作" width="250"  align="center">
                        <template slot-scope="scope" v-if="!scope.row.isDefault">
                            <el-button size="mini" type="primary" @click.stop="handlerUpdate(scope.row)">编辑</el-button>
                            <el-button size="mini" type="danger" @click="handlerDelete(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row type="flex" justify="center" >
                    <el-pagination
                            style="float: right;margin: 4px"
                            @size-change="sizeChange"
                            @current-change="currentChange"
                            :current-page="queryItem.pageNo"
                            :page-sizes="[10, 20, 30, 50]"
                            :page-size="queryItem.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="queryItem.total">
                    </el-pagination>
                </el-row>
            </div>
            <el-dialog  :title="dialogTit" :visible.sync="dialogFormVisible" width="1200px" append-to-body>
                <div class="wrap_">
                    <el-form :model="form" :inline="true" :rules="rules" ref="formTable">
                        <div class="dialogRows">
                            <div class="">
                                <el-form-item label="类型名称" prop="name">
                                    <el-input size="mini" v-model="form.name" placeholder="请输入"></el-input>
                                </el-form-item>
                            </div>
                            <div class="">
                                <el-form-item label="类型编码" prop="code">
                                    <el-input size="mini" v-model="form.code" placeholder="请输入"></el-input>
                                </el-form-item>
                            </div>
                        </div>
                       <div class="btnFun">
                            <el-button type="primary" size="mini" icon="el-icon-plus"  @click="handlerSubmit('formTable')" style="width: 90px;height: 30px;">保存</el-button>
                            <el-button type="primary" size="mini" icon="el-icon-close"  @click.native="dialogFormVisible = false" style="width: 90px;height: 30px">取消</el-button>
                        </div>
                    </el-form>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
    name: "deviceType",
    data() {
        return {
            queryItem: {
                name: '',
                code: '',
                pageNo: 1,
                pageSize: 10,
                total: 0
            },
            tableData: [],
            listLoading: false,
            dialogFormVisible: false,
            dialogTit: '',
            form: {
                name: '',
                code: ''
            },
            formType: '',
            rules: {
                name: [{
                    required: true,
                    message: '请输入设备类型名称',
                    trigger: ['blur',"change"]
                }],
                code: [{
                    required: true,
                    message: '请输入设备类型编码',
                    trigger: ['blur',"change"]
                }],
            },
        }
    },
    mounted() {
        this.getList();
    },
    methods: {
        getList() {
            let self = this;
            let params = self.queryItem;
            self.listLoading = true;
            self.$post('equipment', 'pageTypes', params).then(response => {
                if (response && response.code == '1' && response.result && response.result.records) {
                    self.listLoading = false;
                    let records = response.result.records;
                    let total = response.result.total;
                    self.tableData = records;
                    self.queryItem.total = total;
                } else {
                    self.listLoading = false;
                }
            }).catch(() => {
                self.listLoading = false;
            });
        },
        handleCloseDialog() {
            this.$emit('handleCloseDevTypeDialog');
            this.handlerQuery();
        },
        //查询事件
        handlerQuery() {
            this.queryItem.pageNo = 1;
            this.getList();
        },
        //重置事件
        handlerReset() {
            this.queryItem.pageNo = 1;
            this.queryItem.name = '';
            this.queryItem.code = '';
            this.getList();
        },
        sizeChange(size) {
            this.queryItem.pageSize = size;
            this.getList();
        },
        currentChange(current){
            this.queryItem.pageNo = current;
            this.getList();
        },
        //新增
        handlerAdd(){
            this.formType = 'add';
            this.dialogTit = '新增';
            for (let x in this.form) {
                this.form[x]='';
            }
            this.dialogFormVisible = true;
            this.$nextTick(()=>{
                this.$refs['formTable'].clearValidate();
            });
        },
        handlerUpdate(row){
            let self = this;
            let id = row.id;
            let name = row.name;
            let code = row.code;
            for (let x in this.form) {
                self.form[x]='';
            }
            self.form.id = id;
            self.form.name = name;
            self.form.code = code;
            self.dialogFormVisible = true;
            self.formType = 'edit';
            self.dialogTit = '编辑';
        },
        //保存事件
        handlerSubmit(formName){
            this.$refs[formName].clearValidate();//关闭验证规则
            this.$refs[formName].validate((valid) => {
                if(valid){
                    if(this.formType == 'add'){
                        this.$post('equipment','addType',this.form,'application/json;charset=utf-8').then(res => {
                            console.log('add',res);
                            if (res&&res.code == 1){
                                this.$message({
                                    type: 'success',
                                    message: res.msg
                                });
                                this.dialogFormVisible = false;
                                this.getList();
                            } else{
                                this.$message.error(res.msg||"保存失败");
                            }
                        })
                    }else if(this.formType == 'edit'){
                        this.$post('equipment','updateType',this.form,'application/json;charset=utf-8').then(res => {
                            if (res&&res.code==1){
                                this.$message({
                                    type: 'success',
                                    message: res.msg
                                });
                                this.dialogFormVisible = false;
                                this.getList();
                            }else {
                                this.$message.error(res.msg||"修改失败");
                            }
                        })
                    }
                }
            })
        },
        //删除事件
        handlerDelete(row){
            if(row.id == null || row.id == undefined){
                this.$message({type: 'error', message: "id为空"});
            }else {
                let id = row.id;
                let params = {
                    id:id,
                };
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(() => {
                    this.$post('equipment','deleteType',params,'application/json;charset=utf-8').then(res => {
                        console.log('delete',res);
                        if (res.code==1){
                            this.$message({
                                type: 'success',
                                message: res.msg
                            });
                            this.queryItem.pageNo = 1;
                            this.getList();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }

                    })
                })
            }
        }
    }
}
</script>

<style scoped>
    >>>.el-cascader .el-input, .el-cascader .el-input__inner{
        width: 178px;
    }
    >>>.el-form-item{
        margin-bottom: 5px;
    }
    >>>.el-form-item__label{
        color: #333;
    }
    >>>.el-form-item__error{
        padding-top: 0;
    }
    .devicetype{
        width: 100%;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
    }
    .containerWrap{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;;
    }
    .searchWrap{
        /*height: 40px;*/
        /*line-height: 40px;*/
        margin-bottom: 10px;
        /* background-color: #ffffff; */
        /* box-shadow: 0px 0px 5px 0px rgba(7, 149, 230, 0.2); */
    }
    .searchFrom .rightSpan{
        float: left;
        padding-left: 10px;
        line-height: 30px;
    }
    .table_box{
        height: calc(50vh - 40px);
        background: #FFFFFF;
        /* box-shadow: 0 2px 10px 0 rgba(7,47,100,0.10); */
        border-radius: 4px 4px;
        padding: 10px;
        padding-bottom: 0;
    }
    .searchFrom{
        width:100%;
        height: 42px;
        position: relative;
    }
    .dialogRows{
        width: 100%;
        height: 57px;
        display: flex;
        justify-content: center;
        align-self: center;
        position: relative;
    }
    .dialogRows>div{
        flex:1;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
    }
    .btnFun{
        text-align: center;
        margin:10px 10px 10px 0;
    }
    .demo-table-expand {
        font-size: 0;
        color:#053D9E !important;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    >>>.el-date-editor.el-input, .el-date-editor.el-input__inner{
        width: 178px;
    }
    >>>.el-input--mini .el-input__inner{
        width: 178px;
    }
    >>>.el-pagination__sizes .el-input .el-input__inner{
        width: 100px;
    }
    >>>.el-dialog{
        border: 0;
    }
    .tabContent >>>.el-table .cell {
        text-align: center;
    }
    .dialogContent{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        z-index: 99;
    }
    .closeBtn{
       /* width: 30px;
        height: 30px;
        background: url("../../../static/img/kshgl/closeDialog.png") no-repeat;*/
        position: absolute;
        top: 15px;
        right: 15px;
        cursor: pointer;
    }
    .closeBtn:before{
        font-family: element-icons!important;
        content: "\E60F";
        font-style: normal;
        font-weight: 400;
        font-variant: normal;
        text-transform: none;
        line-height: 1;
        vertical-align: baseline;
        display: inline-block;
        -webkit-font-smoothing: antialiased;
        color: #30e9ff;
        font-size: 30px;
    }
</style>