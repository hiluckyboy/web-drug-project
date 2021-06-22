<template>
    <div>
        <el-row>
            <el-col :span="24" style="padding-bottom:30px;">
                <div class="title">药物相互作用影响驾驶能力查询</div>
            </el-col>
            <el-col :span="24" style="padding-bottom:30px;">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item style="width:40%;">
                        <el-input v-model="formInline.query" placeholder="药物相互作用影响驾驶能力查询（请输入两种或以上药物）"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="query">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col>
                <el-card class="box-card" v-if="list.length !== 0">
                    <div v-for="(item,index) in list" :key="index" style="text-align: left">
                        <el-row v-if="item.yaowuName1">
                            <el-col :span="4">药物名称1:</el-col>
                            <el-col :span="20">{{item.yaowuName1}}</el-col>
                        </el-row>
                        <el-row v-if="item.yaowuName2">
                            <el-col :span="4">药物名称2:</el-col>
                            <el-col :span="20">{{item.yaowuName2}}</el-col>
                        </el-row>
                        <el-row v-if="item.yaowuName3">
                            <el-col :span="4">药物名称3:</el-col>
                            <el-col :span="20">{{item.yaowuName3}}</el-col>
                        </el-row>
                        <el-row v-if="item.yaowuName4">
                            <el-col :span="4">药物名称4:</el-col>
                            <el-col :span="20">{{item.yaowuName4}}</el-col>
                        </el-row>
                        <el-row v-if="item.yaowuName5">
                            <el-col :span="4">药物名称5:</el-col>
                            <el-col :span="20">{{item.yaowuName5}}</el-col>
                        </el-row>
                        <el-row v-if="item.yaowuName6">
                            <el-col :span="4">药物名称6:</el-col>
                            <el-col :span="20">{{item.yaowuName6}}</el-col>
                        </el-row>
                        <el-row v-if="item.yaowuName7">
                            <el-col :span="4">药物名称7:</el-col>
                            <el-col :span="20">{{item.yaowuName7}}</el-col>
                        </el-row>
                        <el-row v-if="item.yaowuName8">
                            <el-col :span="4">药物名称8:</el-col>
                            <el-col :span="20">{{item.yaowuName8}}</el-col>
                        </el-row>
                        <el-row v-if="item.yaowuName9">
                            <el-col :span="4">药物名称9:</el-col>
                            <el-col :span="20">{{item.yaowuName9}}</el-col>
                        </el-row>
                        <el-row v-if="item.yaowuName10">
                            <el-col :span="4">药物名称10:</el-col>
                            <el-col :span="20">{{item.yaowuName10}}</el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">不良反应:</el-col>
                            <el-col :span="20">{{item.buliangfy}}</el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">备注:</el-col>
                            <el-col :span="20">{{item.beizu}}</el-col>
                        </el-row>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    export default {
        name:"query-xh",
        data(){
            return {
                formInline: {
                    query: ''
                },
                list:[]
            }
        },
        methods:{
            query(){
                let that = this;
                $.ajax({
                    url:'/platform-api/Platform/services/yaowuxhzy/queryList?str='+that.formInline.query,
                    type:"POST",
                    success:function(res){
                        console.log(res)
                        if(res.code === 200 ){
                            that.list = JSON.parse(res.data);
                        }
                    }
                })
            }
        }
    }
</script>
<style scoped></style>
