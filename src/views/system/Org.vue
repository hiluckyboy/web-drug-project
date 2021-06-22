<template>
    <el-container>
        <el-aside style="margin: 20px" width="200px">
            <el-input suffix-icon="fa fa-search" size="mini" placeholder="输入关键字搜索" clearable v-model="filterText">
            </el-input>
            <el-tree :highlight-current="true" style="margin-top: 20px" ref="tree_org" :filter-node-method="filterNode"
                     node-key="id"
                     :data="treeData" @current-change="change"
                     :props="treeConfig"
                     :default-expanded-keys="expanded"
            ></el-tree>
        </el-aside>
        <el-main>
            <el-form :model="form" status-icon :rules="rules" ref="formNode" label-width="80px"
                     style="width:60%;min-width:600px;">
                <!--style="margin:20px;width:60%;min-width:600px;">-->
                <el-form-item size="mini" label="机构名称" prop="fullName">
                    <el-input auto-complete="off" v-model="form.fullName" label="机构名称" placeholder="请输入机构名称"></el-input>
                </el-form-item>
                <el-form-item size="mini" label="机构简称" prop="simpleName">
                    <el-input v-model="form.simpleName" label="机构简称" placeholder="请输入机构名称"></el-input>
                </el-form-item>
                <el-form-item size="mini" label="机构排序" prop="num">
                    <el-input-number :min="1" :max="99999" controls-position="right" v-model="form.num" label="机构排序"
                                     placeholder=""></el-input-number>
                </el-form-item>
                <el-form-item size="mini" label="上级机构" prop="pid">
                    <el-cascader @change="parentIdsChange" :disabled="parentFlag" v-model="form.parentIds"
                                 :options="treeData" :props="treeConfig"
                                 :change-on-select="true" :show-all-levels="false" :filterable="true"
                                 :value="form.parentIds"></el-cascader>
                    <!--<el-input v-model="form.parentName" :disabled="true" label="上级机构" placeholder=""></el-input>-->
                </el-form-item>
                <el-form-item size="mini" label="描述" prop="tips">
                    <el-input :autosize="{minRows:2,maxRows:4}" v-model="form.tips" label="描述" type="textarea"
                              placeholder="请输描述"></el-input>
                </el-form-item>
                <el-form-item style="text-align: center">
                    <el-button type="primary" @click.native.prevent="addClick" size="mini" icon="el-icon-plus">新增
                    </el-button>
                    <el-button type="primary" @click.native.prevent="handleSubmit" size="mini" icon="fa fa-save fa-fw">
                        保存
                    </el-button>
                    <el-button type="primary" @click.native.prevent="deleteClick" size="mini" icon="el-icon-delete">删除
                    </el-button>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>

<script>
    import treeUtil from '../../util/treeUtil';

    export default {
        name: "Org",
        data() {
            let pidValidate = function (rule, val, callback) {
                if (!val && this.form.id != 1) {
                    callback(new Error('上级机构不能为空'));
                }
                callback();
            }
            return {
                treeData: [],
                treeConfig: {
                    label: "fullName",
                    value: 'id',
                    children: 'children'
                },
                parentFlag: false,
                expanded: [],
                form: {
                    fullName: '',
                    simpleName: '',
                    tips: '',
                    parentName: '',
                    pid: '',
                    num: '',
                    parentIds: []
                },
                rules: {
                    fullName: [
                        {required: true, message: "机构名称不能为空", trigger: 'blur'},
                        {max: 255, message: "机构名称长度不能超过255", trigger: 'blur'}
                    ],
                    simpleName: [
                        {max: 45, message: "机构简称长度不能超过45", trigger: 'blur'}
                    ],
                    tips: [
                        {max: 255, message: "描述长度不能超过255", trigger: 'blur'}
                    ]
                },
                filterText: "",

            }
        },
        methods: {
            query(data, expanded) {
                this.$post('org', 'query').then(res => {
                            if(res.code == 401)
                {
            // this.$alert('请求超时,正在返回,请重新登录!', '请求超时', {
            // confirmButtonText: '确定'
            // }).then(()=>{
            //     sessionStorage.removeItem('user');
            //     that.$router.push('/login');
            // });
                }
                            if (res && res.code == 200) {
                                let tree = treeUtil.buildTreeNodeByParent(JSON.parse(res.data), {children: this.treeConfig.children});
                                console.log(typeof (tree))
                                this.treeData = tree;
                                this.$refs.formNode.clearValidate();
                                if (data) {
                                    this.setForm(data);
                                } else if (tree && tree[0]) {
                                    this.setForm(tree[0]);
                                }
                                if (expanded) {
                                    this.expanded = [expanded];
                                }
                            } else {
                                this.$message.error(res.msg || "查询失败！");
                            }
                        }
                );
            },
            filterNode(val, data) {
                if (!val)
                    return true;
                return data.fullName.indexOf(val) !== -1;
            },
            change(data, node) {
                this.setForm(data);
            },
            setForm(data) {
                if (data.pid) {
                    this.$refs.formNode.clearValidate();
                    let temp = {};
                    let parentIds = this.getParentIds(data.pids);
                    console.log('parentIds')

                    console.log(parentIds)
                    console.log(typeof(parentIds))

                    temp = Object.assign(temp, data);
                    this.form = temp;
                    this.form.parentIds = [...parentIds];
                    if (data.pid == 0)
                        this.parentFlag = true;
                    else
                        this.parentFlag = false;
                }
            },
            addClick() {
                let pid = this.form.id;
                let pids = this.form.pids;
                let parentIds = this.form.parentIds;
                if (!pid) {
                    this.$message.error("请先选择上级机构");
                    return;
                }
                if (!parentIds || parentIds.length <= 0)
                    parentIds = this.getParentIds(pids);
                parentIds.push(pid);
                this.$refs.formNode.clearValidate();
                this.form = {pid: pid, num: 1, parentIds: parentIds};
            },
            handleSubmit() {
                this.$refs.formNode.validate((res) => {
                    if (res) {
                        let loading = this.$loading({fullscreen: true});
                        let data = this.form;
                        console.log('dat' + typeof (data))
                        let operation = "add";
                        if (data.id) {
                            operation = "update";
                        }
                        delete data.parentIds;
                        this.$post('org', operation, data).then(ret => {
                            loading.close();
                            if (ret && ret.code == 200) {
                                this.filterText = "";
                                this.query(ret.data, data.pid);
                                this.$message.success("操作成功！");
                            } else {
                                this.$message.error(ret.msg || "操作失败")
                            }
                        }).catch(ret => {
                            loading.close();
                        });
                    }
                });
            }, deleteClick() {
                let data = this.form;
                if (!data) {
                    this.$message.warning("请选择一个机构！");
                    return;
                }
                this.$confirm('确认要删除该机构吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$post('org', 'delete', {ids: data.id}).then(res => {
                        if (res && res.code == 200) {
                            this.query(null, data.pid);
                            this.$message.success("删除成功！");
                        } else {
                            this.$message.error(res.msg || "删除失败！");
                        }
                    }).catch(res => {
                    });
                });
            },
            getParentIds(pids) {
                if (pids) {
                    let arrPids = pids.split(',');
                    if (arrPids.length > 0) {
                        let parentIds = [];
                        for (let i = 1; i < arrPids.length - 1; i++) {
                            let temp = arrPids[i];
                            parentIds.push(temp.substring(1, temp.length - 1));
                        }
                        return parentIds;
                    }
                }
                return [];
            },
            parentIdsChange(val) {
                console.log('this.form.parentIds')
                console.log(typeof (this.form.parentIds))
                console.log(this.form.parentIds)
                if (val && val.length > 0) {
                    this.form.pid = val[val.length - 1];
                    let pids = [];
                    for (let i in val) {
                        pids.push('[' + val[i] + ']');
                    }
                    this.form.pids = JSON.stringify(pids);
                }
            },
            init() {
                this.query();
            }
        },
        mounted() {
            this.init();
        },
        watch: {
            filterText(val) {
                this.$refs.tree_org.filter(val);
            }
        },
        computed: {}
    }
</script>

<style scoped>
</style>
