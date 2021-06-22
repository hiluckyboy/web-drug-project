<template>
  <section class="chart-container">
    <el-col>
        <el-row type="flex" justify="end" style="margin-bottom: 5px">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddMenuView">新增</el-button>
        </el-row>
    </el-col>
    <tree-table :data="menus" :columns="columns" v-on:expands="onExpands">
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini"  @click="showEditMenuView(scope.row)">编辑</el-button>
          <el-button type="text" size="mini" @click="delMenu(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </tree-table>
    <el-dialog
        :title="dialogTitle"
        style="padding: 0px;"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        width="70%">
      <el-form :model="menu" :rules="rules" label-width="200px" ref="addMenuForm" inline label-position="right">
        <el-row>
          <el-col :span="12">
            <div>
              <el-form-item label="上级菜单:" prop="pid">
                <el-select v-model="menu.pid" size="mini" filterable @change="changePid" clearable placeholder="请选择上级菜单">
                  <el-option
                    v-for="item in menulist"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
                <el-form-item label="菜单类型:" prop="title">
                    <el-select v-model="menu.type" size="mini" clearable placeholder="请选择上级菜单">
                        <el-option
                            label="前端接口"
                            value="0">
                        </el-option>
                        <el-option
                            label="后台接口"
                            value="1">
                        </el-option>
                    </el-select>
<!--                    <el-input v-model="menu.type" size="mini"-->
<!--                              placeholder="类型"></el-input>-->
                </el-form-item>
 
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
                <div>
                    <el-form-item label="中文名称:" prop="title">
                        <el-input v-model="menu.title" size="mini"
                                  placeholder="请输入路由中文名称"></el-input>
                    </el-form-item>
                </div>
            </el-col>
          
          <el-col :span="12">
            <div>
              <el-form-item label="访问路径:" prop="path">
                <el-input v-model="menu.path" size="mini"
                          placeholder="请输入访问路径"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div>
              <el-form-item label="前端页面路径:" prop="component">
                <el-input v-model="menu.component" size="mini"
                          placeholder="请输入前端页面路径"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              <el-form-item label="路由唯一名称:" prop="name">
                <el-input v-model="menu.name" size="mini"
                          placeholder="请输入路由唯一名称"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div>
              <el-form-item label="排列顺序:" prop="num">
                <el-input v-model.number="menu.num" type="number" size="mini"
                          placeholder="请输入排序"></el-input>
              </el-form-item>
            </div>
          </el-col>
          
          <el-col :span="12">
            <div>
              <el-form-item label="后端接口权限:" prop="permission">
                <el-input v-model="menu.permission" size="mini"
                          placeholder="请输入后端接口权限"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
            <div>
              <el-form-item label="当前路由图标:" prop="icon">
                <el-input v-model="menu.icon" size="mini"
                          placeholder="请输入图标"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              <el-form-item label="跳转方式:" prop="newLink">
                <el-select v-model="menu.newLink" size="mini" placeholder="请选择跳转方式">
                        <el-option
                            label="当前页面"
                            value="0">
                        </el-option>
                        <el-option
                            label="新开窗口"
                            value="1">
                        </el-option>
                    </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
            <div>
              <el-form-item label="是否跳转到IE:" prop="jumpIE">
                <el-select v-model="menu.jumpIE" size="mini" placeholder="是否跳转到IE">
                        <el-option
                            label="否"
                            value="0">
                        </el-option>
                        <el-option
                            label="是"
                            value="1">
                        </el-option>
                    </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
    </el-form>
    <div slot="footer">
      <el-button  @click="cancelEidt">取 消</el-button>
      <el-button  type="primary" @click="addMenu('addMenuForm')">确 定</el-button>
    </div>
  </el-dialog>
  </section>
 
</template>
 
<script>
import treeTable from '@/components/TreeTable'
 
export default {
  components: { treeTable },
  data() {
    return {
      menus:[],
      menu: {
        path: '',
        component: '',
        name: '',
        title: '',
        icon: '',
        permission: '',
        num:'',
        pid: '',
        description: '',
          type:'',
          newLink :0,
          jumpIE:0
      },
      expands:[],
      menulist:[],
      dialogVisible:false,
      dialogTitle:'',
      columns: [
        {
          text: '路由中文名称',
          value: 'title'
        },
        {
          text: '排序',
          value: 'num'
        },
        {
          text: '访问路径',
          value: 'path',
          width: 200
        },
        {
          text: '前端页面路径',
          value: 'component',
        },
        {
          text: '路由唯一名称',
          value: 'name'
        },
        {
          text: '图标',
          value: 'icon'
        },
        {
          text: '后端接口权限',
          value: 'permission'
        }
      ],
      rules: {
        path: [{required: true, validator: this.$checkData, trigger: 'blur'}],
        num: [{required: true, message: '必填:排序'},
              {type: 'number',min: 1, message: '必须为正整数'}],
        component: [{required: true, validator: this.$checkData, trigger: 'blur'}],
        name: [{required: true, validator: this.$checkData, trigger: 'blur'}],
        title: [{required: true, message: '必填:路由中文名称', trigger: 'blur'}],
        newLink: [{required: true, message: '必填:跳转方式', trigger: 'change'}],
        jumpIE:[{required: true, message: '必填:是否跳转IE', trigger: 'change'}],
        permission: [{required: true, validator: this.$checkData, trigger: 'blur'}],
      }
    }
  },
  methods: {
    initMenulist(){
      var _this = this;
      this.$get("menu", "list").then((ret) => {
          console.log(ret)
          console.log('ssssss')
        if (ret) {
          _this.menulist = JSON.parse(ret.data);
        }
      })
    },
    loadMenus(){
      var _this = this;
      this.$get("menu", "listTreeTable").then((ret) => {
        if (ret) {
          console.log('listTreeTable',JSON.parse(ret.data))
          for(let i in JSON.parse(ret.data)){
            if(this.expands.indexOf(JSON.parse(ret.data)[i].id)!=-1){
              JSON.parse(ret.data)[i]._expanded = true;
            }
            for(let j in JSON.parse(ret.data)[i].children){
              if(this.expands.indexOf(JSON.parse(ret.data)[i].children[j].id)!=-1){
                JSON.parse(ret.data)[i].children[j]._expanded = true;
              }
            }
          }
          _this.menus = JSON.parse(ret.data);
 
        }
      })
    },
    cancelEidt(){
      this.dialogVisible = false;
      this.emptyMenuData();
    },
    emptyMenuData(){
      this.menu = {
        path: '',
        component: '',
        name: '',
        title: '',
        icon: '',
        permission: '',
        num:'',
        pid:'',
        description: '',
          type:'',
      }
    },
    changePid(){
      if(this.menu.pid == this.menu.id){
        this.$message("上级路由不能选自己");
        this.menu.pid = '';
      }
      console.log("changePid:"+this.menu.pid);
    },
    showEditMenuView(row){
      this.dialogTitle = "编辑菜单";
      let menu = {
        id: row.id,
        path: row.path,
        component: row.component,
        name: row.name,
        title: row.title,
        icon: row.icon,
        num: row.num,
        pid: row.pid==1?'':row.pid,
        permission: row.permission,
        description: row.description,
        type:row.type,
        newLink:row.newLink == 0 ? '当前页面':'新开窗口',
        jumpIE:row.jumpIE == 0 ? '否':'是'
      }
      this.menu = menu;
      console.log(row)
      this.dialogVisible = true;
    },
    showAddMenuView(){
      this.emptyMenuData();
      this.dialogTitle = "添加菜单";
      this.dialogVisible = true;
    },
    addMenu(formName){
      var _this = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.menu.id) {
            if(this.menu.newLink == "当前页面"){
              this.menu.newLink = 0;
            }else if(this.menu.newLink == "新开窗口"){
              this.menu.newLink = 1;
            }
            if(this.menu.jumpIE == "否"){
              this.menu.jumpIE = 0;
            }else if(this.menu.jumpIE == "是"){
              this.menu.jumpIE = 1;
            }
            console.log(this.menu)
            //更新
            this.$post("menu","update", this.menu).then(ret=> {
              if (ret) {
                _this.$message.success(ret.msg);
                _this.dialogVisible = false;
                _this.emptyMenuData();
                _this.loadMenus();
                _this.initMenulist();
              }
            })
          } else {
            //添加
            this.$post("menu","add", this.menu).then(ret=> {
              if (ret) {
                _this.$message.success(ret.msg);
                _this.dialogVisible = false;
                _this.emptyMenuData();
                _this.loadMenus();
                _this.initMenulist();
              }
            })
          }
        } else {
          return false;
        }
      });
    },
    delMenu(row) {
      this.$confirm('确认要删除该菜单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$post("menu", "delete",{id:row.id}).then((ret) => {
          if(ret){
            this.$message.success(ret.msg);
            this.loadMenus();
            _this.initMenulist();
          }
        })
      });
    },
    onExpands(index){
      console.log("onExpands:"+index);
      if(this.expands.indexOf(index)!=-1){
        console.log("splice:"+index);
        this.expands.splice(index,1);
      }else{
        console.log("push:"+index);
        this.expands.push(index);
      }
    }
  },
  mounted: function () {
      this.initMenulist();
      this.loadMenus();
  }
 
}
</script>
<style scoped>
    >>> .el-select{
        width: 100%;
    }
    >>>.el-form-item{
      width:100%;
    }
    >>>.el-cascader .el-input, .el-cascader .el-input__inner{
        width: 178px;
    }
    >>> .el-dialog .el-form-item__content{
        width:400px;
    }
</style>