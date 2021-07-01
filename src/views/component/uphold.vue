<template>
    <div class="main" style="text-align: left;padding-top:20px;">
        <el-form
            :inline="true"
            :model="formInline"
            class="demo-form-inline"
        >
            <el-form-item label="请输入药品名">
                <el-input v-model="formInline.name" placeholder="请输入药品名"></el-input>
            </el-form-item>
            <el-form-item style="flex: 1" class="special">
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="primary" @click="onReset">重置</el-button>
                <el-button type="success" @click="onAdd">新增</el-button>
                <el-button type="info" @click="downloading" style="float: right;">下载模板</el-button>

                <download-excel
                    :fields="json_fields"
                    :data="list.data"
                    name="药物信息.xlsx"
                    class="daochu-demo"
                >
                    <el-button type="primary">导出</el-button>
                </download-excel>
                <el-upload
                    ref="upload"
                    class="upload-demo"
                    :action="url + '/Platform/services/yxjsyaowu/importExcel'"
                    multiple
                    :on-success="handleAvatarSuccess"
                    :on-error="handleError"
                    :show-file-list=showFileList
                    :before-upload="checkFileType"
                    :file-list="fileList">
                    <el-button type="primary">
                        导入
                    </el-button>
                </el-upload>
            </el-form-item>
        </el-form>
        <elTable
            :list="list"
            @handleSizeChange="sizeChange"
            @handleCurrentChange="currentChange"
            v-if="showTable"
        ></elTable>
        <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            width="50%">
            <el-row :gutter="20">
                <el-form :inline="true" :rules="rules" :model="ruleForm" ref="ruleForm" label-width="122px">
                    <el-col :span="12">
                        <div class="grid-content">
                            <el-form-item label="药物名称" prop="name">
                                <el-input v-model="ruleForm.name" placeholder="药物名称"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="grid-content">
                            <el-form-item label="不良反应" prop="buliangfyfl">
                                <el-select v-model="ruleForm.buliangfyfl" placeholder="不良反应">
                                    <el-option
                                        v-for="item in options"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="grid-content">
                            <el-form-item label="不良反应发生率">
                                <el-input v-model="ruleForm.blfyfsl" placeholder="不良反应发生率"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="grid-content">
                            <el-form-item label="影响驾驶等级">
                                <el-select v-model="ruleForm.yxjsdj" placeholder="影响驾驶等级">
                                    <el-option
                                        v-for="item in optionDj"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>

                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="grid-content">
                            <el-form-item label="药物分类" prop="yaowufl">
                                <el-select v-model="ruleForm.yaowufl" placeholder="药物分类">
                                    <el-option
                                        v-for="item in optionYw"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="grid-content">
                            <el-form-item label="证据来源">
                                <el-input v-model="ruleForm.zhengjuly" placeholder="证据来源"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="grid-content">
                            <el-form-item label="备注">
                                <el-input v-model="ruleForm.beizhu" placeholder="备注"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-form>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('ruleForm')">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import elTable from '../../components/table/el_table.vue'
    import publicData from './public.js'
    export default {
        name:"uphold",
        data(){
            return {
                url:publicData.url,
                fileList:[],
                showFileList:false,
                dialogVisible: false,
                formInline: {
                    name: '',
                },
                queryItem:{
                    pageNo:1,
                    pageSize:10
                },
                json_fields:{
                    "药物名称": "name",
                    "不良反应": "buliangfyfl",
                    "不良反应发生率": "blfyfsl",
                    "影响驾驶等级": "yxjsdj",
                    "药物分类": "yaowufl",
                    "证据来源": "zhengjuly",
                    "备注": "beizhu"
                },
                title:"新增药物",
                list: {
                    data: [], //表格数据
                    IsSerial: true, //是否显示序号
                    TableListThead: [
                        {
                            prop: "name",
                            label: "药物名称",
                        },
                        {
                            prop: "buliangfyfl",
                            label: "不良反应",
                        },
                        {
                            prop: "blfyfsl",
                            label: "不良反应发生率",
                        },
                        {
                            prop: "yxjsdj",
                            label: "影响驾驶等级",
                        },
                        {
                            prop: "yaowufl",
                            label: "药物分类",
                        },
                        {
                            prop: "zhengjuly",
                            label: "证据来源",
                        },
                        {
                            prop: "beizhu",
                            label: "备注",
                        },
                    ], //表头
                    ExtraOperation: [
                        {
                            name: "编辑",
                            click: "change",
                        },
                        {
                            name: "删除",
                            click: "delete",
                        },
                    ], // 操作栏-自定义按钮
                    IsUseOperation: true, // 是否开启操作栏
                    // 非必填
                    pageSizes: [10, 20, 30, 50], //
                    pageSize: 10,
                    thetotal: 0, // 表格总数
                    currentPage: 1, // 显示第几页
                },
                showTable: true,
                options:[],
                optionYw:[],
                optionDj:[
                    {
                        value: '高',
                        label: '高'
                    }, {
                        value: '中高',
                        label: '中高'
                    }, {
                        value: '中',
                        label: '中'
                    }, {
                        value: '中低',
                        label: '中低'
                    }, {
                        value: '低',
                        label: '低'
                    }
                ],
                ruleForm:{
                    name:"",
                    buliangfyfl:1,
                    blfyfsl:"",
                    yxjsdj:"",
                    yaowufl:1,
                    zhengjuly:"",
                    beizhu:"",
                    id:""
                },
                rules: {
                    name: [
                        { required: true, message: '请输入药物名称', trigger: 'blur' },
                    ],
                    buliangfyfl: [
                        { required: true, message: '请选择不良反应分类', trigger: 'change' }
                    ],
                    yaowufl: [
                        { required: true, message: '请选择药物分类', trigger: 'change' }
                    ],
                }
            }
        },
        components:{
            elTable
        },
        mounted(){
            this.queryYw();
        },
        methods:{
            /*-------------------导入------------------*/
            handleAvatarSuccess(response, file, fileList){
                this.$message({
                    type: 'success',
                    message: JSON.parse(response.data)
                });
                this.queryYw();
            },
            handleError(err,file, fileList){
                this.$message({
                    type: 'error',
                    message: '您输入的数据有误，请按照模板格式填写。'
                });
            },
            checkFileType(file){
                const fileSuffix = file.name.substring(file.name.lastIndexOf(".")+1);
                if(fileSuffix === 'xlsx'){
                    return ;
                }else{
                    this.$message({
                        type: 'error',
                        message: '请按照模板格式上传正确的.xls文件'
                    });
                }
            },
            downloading(){
                this.$downloadFile("药物维护模板.xlsx","/platform-api/Platform/services/yxjsyaowu/downYaowuExcel");
            },
            /*-------------------导入 end------------------*/
            submitForm(formName) {
                let that = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log(that.ruleForm)
                        if(that.title == "新增药物"){
                            that.$post("drug","add",that.ruleForm).then(res=>{
                                if(res.code == 200){
                                    that.dialogVisible = false;
                                    that.init();
                                    that.$message({
                                        message: '添加成功',
                                        type: 'success'
                                    });
                                    that.resetFormList();
                                }else{
                                    that.$message.error("服务错误")
                                }
                            })
                        }else{
                            that.$post("drug","update",that.ruleForm).then(res=>{
                                if(res.code == 200){
                                    that.dialogVisible = false;
                                    that.init();
                                    this.$message({
                                        message: '更新成功',
                                        type: 'success'
                                    });
                                    that.resetFormList();
                                }else{
                                    that.$message.error("服务错误")
                                }
                            })
                        }

                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.dialogVisible = false;
                this.resetFormList();
                this.$refs[formName].resetFields();
            },
            resetFormList(){
                this.ruleForm={
                    name:"",
                    buliangfyfl:1,
                    blfyfsl:"",
                    yxjsdj:"",
                    yaowufl:1,
                    zhengjuly:"",
                    beizhu:"",
                    id:""
                };
            },
            init(){
                let that = this;
                let params = Object.assign({"name":that.formInline.name},that.queryItem);
                that.$post("drug","yxjsyaowu",params).then(res=>{
                    if(res.code == 200){
                        let data = JSON.parse(res.data);
                        that.list.data = data.records;
                        that.list.data.map(res=>{
                            res.buliangfyfl = that.setFy(res.buliangfyfl);
                            res.yaowufl = that.setYw(res.yaowufl);
                        });
                        that.list.thetotal = data.total;
                        that.showTable = false;
                        that.$nextTick(()=>{
                            that.showTable = true;
                        })
                    }else{
                        that.$message.error('服务错误');
                    }
                })
            },
            // 不良反应分类查询
            queryFy(){
                this.$post("drug","queryListFy").then(res=>{
                    this.options = JSON.parse(res.data);
                }).then(()=>{
                    this.init();
                })
            },
            setFy(id){
                console.log(id)
                let arr = this.options.filter(res=>{
                    return id == res.id
                });
                console.log(arr)
                return arr[0].name;
            },
            queryYw(){
                this.$post("drug","queryListYw").then(res=>{
                    this.optionYw = JSON.parse(res.data);
                }).then(()=>{
                    this.queryFy();
                })
            },
            setYw(id){
                let arr = this.optionYw.filter(res=>{
                    return id == res.id
                });
                return arr[0].name;
            },
            // 药物分类查询
            onSubmit() {
                this.init()
            },
            onReset(){
                this.formInline.name = "";
                this.queryItem.pageNo = 1;
                this.list.pageSize = 10;
                this.list.currentPage = 1;
                this.init()
            },
            onAdd(){
                this.dialogVisible = true;
            },
            //翻页事件
            sizeChange(size, _this) {
                _this.queryItem.pageSize = size;
                _this.list.pageSize = size;
                _this.init();
            },
            currentChange(current, _this) {
                _this.queryItem.pageNo = current;
                _this.list.currentPage = current;
                _this.init();
            },
            change(item, _this){
                _this.ruleForm.name = item.name;
                _this.ruleForm.buliangfyfl = item.buliangfyfl;
                _this.ruleForm.blfyfsl = item.blfyfsl;
                _this.ruleForm.yxjsdj = item.yxjsdj;
                _this.ruleForm.yaowufl = item.yaowufl;
                _this.ruleForm.zhengjuly = item.zhengjuly;
                _this.ruleForm.beizhu = item.beizhu;
                _this.dialogVisible = true;
                _this.ruleForm.id = item.id;
                _this.title = "编辑药物";
            },
            delete(row,_this){
                _this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    $.ajax({
                        url:"/platform-api/Platform/services/yxjsyaowu/delete?id="+row.id,
                        type:"POST",
                        success: function (res) {
                            if(res.code == 200){
                                _this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                _this.init();
                            }else{
                                _this.$message.error("服务错误");
                            }
                        }
                    });
                }).catch(() => {
                    _this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            }
        }
    }
</script>
<style scoped>
    .main{
        display: block;
    }
    >>> .el-form-item__content{
        width: auto!important;
    }
    >>> .el-dialog .el-form-item,>>> .el-dialog .el-select{
        width: 100%;
    }
    >>> .el-dialog .el-form-item__content{
        width: calc(100% - 122px)!important;
    }
    .demo-form-inline{
        display: flex;
    }
    .upload-demo, .daochu-demo{
        display: inline-block;
        float: right;
        margin-left: 10px;
    }
    >>> .special .el-form-item__content{
        width: 100%!important;
    }
</style>
