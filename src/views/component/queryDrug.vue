<template>
    <div>
        <el-row>
            <el-col :span="24" style="padding-bottom:30px;">
                <div class="title">影响驾驶能力药物查询</div>
            </el-col>
            <el-col :span="24" style="padding-bottom:10px;" class="querydrug">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item style="width: 40%;">
                        <el-input style="width: 100%" v-model="formInline.name" placeholder="商品名、药品名或拼音首字母"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="queryYW">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="24" style="padding-bottom:30px;">
                <el-card v-if="queryList.length !== 0" class="box-card">
                    <div v-for="(item,index) in queryList" :key="index" class="text item" @click="queryDrug(item)">
                        {{(index+1)+'、 ' + item.name }}
                        <div
                            :class="blfyNameFun(item) == 'normal' ? '' :
                            blfyNameFun(item) ? 'error' : 'warning'"
                            style="font-size:24px;margin-top: 30px;text-align: center"
                        >
                           {{blfyNameFun(item) == "normal"?"":blfyNameFun(item) ? "服用该药后请勿驾驶车辆！":'服用该药后请谨慎驾驶车辆！'}}
                        </div>
                        <div style="text-align: center">
                            <img :src="item" width="77" v-for="(item,index) in blfyNameFun1(item)" :key="index" alt="">
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            width="60%"
            v-if="dialogVisible"
        >
            <elTable
                :list="list"
                @handleSizeChange="sizeChange"
                @handleCurrentChange="currentChange"
                v-if="showTable"
            ></elTable>
        </el-dialog>
    </div>
</template>
<script>
    import elTable from '../../components/table/el_table.vue'
    import {unique} from  '../../common/js/common_js.js'
    export default {
        name:"query-drug",
        components:{
            elTable
        },
        data(){
            return {
                formInline: {
                    name: ''
                },
                unData:[],
                status:0,
                queryList:[],
                dialogVisible:false,
                title:"",
                statusList:[
                    {id:0,"title":"眩晕","url":"../../../static/img/status/yx.png"},
                    {id:1,"title":"辩色困难","url":"../../../static/img/status/bskn.png"},
                    {id:2,"title":"多汗","url":"../../../static/img/status/dh.png"},
                    {id:3,"title":"幻觉","url":"../../../static/img/status/hj.png"},
                    {id:4,"title":"视力模糊","url":"../../../static/img/status/slmh.png"},
                    {id:5,"title":"嗜睡","url":"../../../static/img/status/ss.png"},
                    {id:6,"title":"视觉障碍","url":"../../../static/img/status/sjza.png"},
                    {id:7,"title":"疲乏","url":"../../../static/img/status/pf.png"},
                    {id:8,"title":"多尿","url":"../../../static/img/status/dn.png"},
                    {id:9,"title":"手足麻木","url":"../../../static/img/status/szmm.png"},
                    {id:10,"title":"失聪（耳毒性）","url":"../../../static/img/status/sc.png"},
                    {id:11,"title":"定向力障碍","url":"../../../static/img/status/dxlza.png"},
                    {id:12,"title":"低血糖","url":"../../../static/img/status/dxt.png"},
                ],
                list: {
                    data: [], //表格数据
                    IsSerial: true, //是否显示序号
                    TableListThead: [
                        {
                            prop: "name",
                            label: "药物名称",
                        },
                        {
                            prop: "blfyName",
                            label: "不良反应",
                        },
                        {
                            prop: "yxjsdj",
                            label: "影响驾驶等级",
                        },
                    ], //表头
                    ExtraOperation: [], // 操作栏-自定义按钮
                    IsUseOperation: false, // 是否开启操作栏
                    // 非必填
                    pageSizes: [10, 20, 30, 50], //
                    pageSize: 10,
                    thetotal: 0, // 表格总数
                    currentPage: 1, // 显示第几页
                    noPage:false,
                },
                showTable: true,
                src:""
            }
        },
        mounted(){
            // console.log(this.filterDrug())
        },
        methods:{
            queryDrug(item){
                let that = this;
                that.dialogVisible = true;
                that.title = item.name;
                let params = {
                    name: item.name
                };
                that.$post("drug","queryListXH",params).then(res=>{
                    if(res.code === 200){
                        if(res.data.length !== 0){
                            let data = JSON.parse(res.data);
                            that.list.data = data;
                            that.showTable = false;
                            that.$nextTick(()=>{
                                that.showTable = true;
                            })
                        }
                    }else{
                        that.$message.error('服务错误');
                    }
                })
            },
            queryYW(){
                let that = this;
                that.queryList = [];
                let params = {
                    name: that.formInline.name
                };
                that.$post("drug","queryListXH",params).then(res=>{
                    if(res.code === 200){
                        if(res.data.length !== 0){
                            let data = JSON.parse(res.data);
                            that.unData = data
                            that.queryList= unique(data,"name");
                        }
                    }else{
                        that.$message.error('错了哦，这是一条错误消息');
                    }
                })
            },
            blfyNameFun(row){
                let arryName = [];
                this.unData.forEach(item=>{
                    if (item.name == row.name && item.yxjsdj != '低') {
                        arryName.push(item)
                    }
                });
                if(arryName.length !== 0 ){
                    var arr;
                    arr = arryName.filter(res=>{
                        return res.yxjsdj.indexOf("高") !== -1;
                    });
                    return arr.length !== 0;
                }else{
                    return 'normal';
                }
            },
            blfyNameFun1(row){
                let arryName = [];
                this.unData.forEach(item=>{
                    if (item.name == row.name && item.yxjsdj != '低') {
                        arryName.push(item.blfyName)
                    }
                });
                let arrayImg = []
                for(let i=0;i<arryName.length;i++){
                    for(let j=0;j<this.statusList.length;j++){
                        if(arryName[i] == this.statusList[j].title){
                            arrayImg.push(this.statusList[j].url)
                        }
                    }
                }
                return arrayImg
            },
            //翻页事件
            sizeChange(size, _this) {
                _this.queryItem.pageSize = size;
                _this.list.pageSize = size;
                _this.stepTwo();
            },
            currentChange(current, _this) {
                _this.queryItem.pageNo = current;
                _this.list.currentPage = current;
                _this.stepTwo();
            },
        }
    }
</script>
<style scoped>
>>> .querydrug .el-form-item__content{
    width: 100%;
}
</style>
