<template>
  <div style="padding: 10px">
    <el-row type="flex" justify="end">
      <el-col>
        <el-form :inline="true" :model="queryItem">
          <el-row type="flex" justify="start">
            <el-form-item label="姓名">
              <el-input
                v-model="queryItem.name"
                size="mini"
                placeholder="姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="所属机构" @click.native="openTreeList">
              <el-input
                v-model="queryItem.orgName"
                size="mini"
                placeholder="所属机构"
              ></el-input>
            </el-form-item>
            <el-form-item label="创建时间">
              <el-date-picker
                v-model="queryItem.beginDateScope"
                size="mini"
                type="daterange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="query"
                >查询</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-refresh"
                size="mini"
                @click="reset"
                >重置</el-button
              >
            </el-form-item>
          </el-row>
          <!--<el-row type="flex" justify="center">-->
          <!--</el-row>-->
        </el-form>
      </el-col>
    </el-row>
    <el-row type="flex" style="margin-bottom: 5px">
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-download"
        @click="exportUsers"
        >导出</el-button
      >
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-plus"
        @click="addClick"
        >新增</el-button
      >
      <!--<el-button type="primary" size="mini" icon="el-icon-edit" @click="editClick">编辑</el-button>-->
      <!--<el-button type="primary" size="mini" icon="el-icon-delete" @click="removeData">删除</el-button>-->
      <!--<el-button type="primary" size="mini" @click="setRole">角色配置</el-button>-->
    </el-row>
    <el-table :data="tableData" @current-change="selectRow">
      <el-table-column prop="account" label="账号" width="120" align="center">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120" align="center">
      </el-table-column>
      <el-table-column
        prop="orgName"
        label="所属机构"
        width="170"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="sex"
        label="性别"
        width="50"
        align="center"
        :formatter="sexFun"
      >
      </el-table-column>
      <el-table-column prop="idCard" label="身份证号" align="center">
      </el-table-column>
      <el-table-column prop="birthday" label="生日" width="100" align="center">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180" align="center">
      </el-table-column>
      <el-table-column prop="phone" label="手机号" width="120" align="center">
      </el-table-column>
      <el-table-column
        prop="status"
        label="用户状态"
        width="80"
        align="center"
        :formatter="statusFun"
      >
      </el-table-column>
      <el-table-column
        prop="gmt_create"
        label="创建时间"
        align="center"
        :formatter="(row) => theformatTimestamp(row.gmt_create)"
      >
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="220" align="center">
        <template slot-scope="scope">
          <el-button @click="editClick(scope.row)" type="text">编辑</el-button>
          <el-button @click="removeData(scope.row)" type="text">删除</el-button>
          <el-button @click="setRole(scope.row)" type="text"
            >角色配置</el-button
          >
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
        :total="pageData.total"
      >
      </el-pagination>
    </el-row>
    <el-dialog
      title="选择所属机构"
      :visible.sync="treeVisible"
      :close-on-click-modal="true"
    >
      <el-input
        suffix-icon="fa fa-search"
        placeholder="输入关键字搜索"
        v-model="filterText"
      >
      </el-input>
      <el-tree
        :highlight-current="true"
        style="margin-top: 20px"
        ref="tree_org"
        :filter-node-method="filterNode"
        node-key="id"
        :data="treeData"
        @node-click="change"
        :props="treeConfig"
        :default-expanded-keys="expanded"
      ></el-tree>
    </el-dialog>
    <el-dialog
      title="角色配置"
      :visible.sync="rolesVisible"
      :close-on-click-modal="true"
    >
      <el-transfer
        v-model="userRoles"
        :data="allRoles"
        :titles="['角色列表', '已有角色']"
      ></el-transfer>
      <div slot="footer">
        <el-button @click.native="rolesVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click.native="editRoleSubmit"
          :loading="editLoading"
          >提交</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      :title="title"
      :visible.sync="editFormVisible"
      @close="onEditClose"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editForm"
        label-width="80px"
        :rules="this.isNew === true ? editAddFormRules : editFormRules"
        ref="myForm"
        label-position="right"
      >
        <el-form-item label="账号" prop="account">
          <el-input v-model="editForm.account" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="editForm.password"
            type="password"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="rePassword">
          <el-input
            v-model="editForm.rePassword"
            type="password"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="idCard">
          <el-input v-model="editForm.idCard" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker
            style="width: 100%"
            v-model="editForm.birthday"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select
            v-model="editForm.sex"
            placeholder="选择性别"
            style="width: 100%"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editForm.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户类型" prop="userType">
          <el-select
            v-model="editForm.userType"
            placeholder="选择用户类型"
            style="width: 100%"
          >
            <el-option
              v-for="item in optionsType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="所属机构"
          prop="orgName"
          @click.native="openTreeList2"
        >
          <el-input v-model="editForm.orgName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            :action="actionURL"
            :headers="uploadHeader"
            :show-file-list="false"
            :on-success="handleSuccess"
            :on-error="handleError"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="editForm.avatar" :src="editForm.avatar" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click.native="editSubmit"
          :loading="editLoading"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<script>
import treeUtil from "../../util/treeUtil";
import util from "@/util/util.js";
import { formatTimestamp } from "../../common/js/common_js";

export default {
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        // if (this.editForm.rePassword !== '') {
        //     this.$refs.myForm.validateField('password');
        // }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.editForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      options: [
        {
          value: 1,
          label: "男",
        },
        {
          value: 2,
          label: "女",
        },
      ],
      optionsType: [
        {
          value: 1,
          label: "军官",
        },
        {
          value: 2,
          label: "士官",
        },
        {
          value: 3,
          label: "义务兵",
        },
        {
          value: 4,
          label: "文职",
        },
        {
          value: 5,
          label: "职工",
        },
        {
          value: 6,
          label: "老干部",
        },
      ],
      treeData: [],
      treeConfig: {
        label: "fullName",
        children: "children",
      },
      expanded: [],
      filterText: "",
      title: "",
      row: "",
      isNew: true,
      isQuery: true,
      queryItem: {
        name: "",
        orgId: "",
        orgName: "",
        beginDateScope: "",
        orderBy: "",
        isAsc: "",
      },
      tableData: [],
      pageData: {
        current: 1,
        total: 0,
        pageSize: 10,
      },
      editAddFormRules: {
        account: [
          { required: true, validator: this.$checkData, trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: validatePass, trigger: "blur" },
        ],
        rePassword: [
          { required: true, message: "请输入确认密码", trigger: "blur" },
          { validator: validatePass2, trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        idCard: [
          { required: true, message: "请输入身份证号", trigger: "blur" },
        ],
        userType: [
          { required: true, message: "请选择用户类型", trigger: "blur" },
        ],
      },
      editFormRules: {
        account: [{ required: true, message: "请输入名称", trigger: "blur" }],
        // password: [
        //     {required: true, message: '请输入密码', trigger: 'blur'},
        //     {validator: validatePass, trigger: 'blur'}
        // ],
        // rePassword: [
        //     {required: true, message: '请输入确认密码', trigger: 'blur'},
        //     {validator: validatePass2, trigger: 'blur'}
        // ],
        idCard: [
          { required: true, message: "请输入身份证号", trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        birthday: [{ required: true, message: "请选择生日", trigger: "blur" }],
        userType: [
          { required: true, message: "请选择用户类型", trigger: "blur" },
        ],
      },
      editForm: {
        id: "",
        account: "",
        password: "",
        name: "",
        idCard: "",
        birthday: "",
        sex: "",
        email: "",
        phone: "",
        orgId: "",
        rePassword: "",
        orgName: "",
        avatar: "",
        userType: "",
      },
      editLoading: false,
      editFormVisible: false,
      treeVisible: false,
      rolesVisible: false,
      userRoles: [],
      allRoles: [],
      userId: "",
    };
  },
  created() {
    this.getTree();
    this.getList();
    this.getAllRoles();
  },
  methods: {
    theformatTimestamp(res) {
      return formatTimestamp(res);
    },
    statusFun(row) {
      return row.status == 1 ? "启用" : row.status == 2 ? "冻结" : "删除";
    },
    sexFun(row) {
      // console.log(row)
      return row.sex == 1 ? "男" : row.sex == 2 ? "女" : "";
    },
    query() {
      this.pageData.current = 1;
      this.getList();
    },
    getAllRoles() {
      this.$get("user", "listRoles").then((res) => {
        if (JSON.parse(res.data).length < 1) {
          return;
        }
        for (let i = 0; i < JSON.parse(res.data).length; i++) {
          this.allRoles.push({
            key: JSON.parse(res.data)[i].id,
            label: JSON.parse(res.data)[i].name,
          });
        }
      });
    },
    getTree() {
      this.$get("user", "orgTree").then((res) => {
        let tree = treeUtil.buildTreeNodeByParent(JSON.parse(res.data), {
          children: this.treeConfig.children,
        });
        this.treeData = tree;
      });
    },
    filterNode(val, data) {
      if (!val) return true;
      return data.fullName.indexOf(val) !== -1;
    },
    change(data, node) {
      let temp = {};
      temp = Object.assign(temp, data);
      if (this.isQuery) {
        this.queryItem.orgName = temp.fullName;
        this.queryItem.orgId = temp.id;
        this.treeVisible = false;
      } else {
        this.editForm.orgName = temp.fullName;
        this.editForm.orgId = temp.id;
        this.treeVisible = false;
      }
    },
    reset() {
      this.queryItem = {
        name: "",
        orgId: "",
        orgName: "",
        beginDateScope: "",
        orderBy: "",
        isAsc: "",
      };
      this.getList();
    },
    getList() {
      this.$post("user", "pageUser", {
        pageIndex: this.pageData.current,
        pageSize: this.pageData.pageSize,
        name: this.queryItem.name,
        orgId: this.queryItem.orgId,
        beginDateScope: this.queryItem.beginDateScope,
        orderBy: this.queryItem.orderBy,
        isAsc: this.queryItem.isAsc,
      }).then((res) => {
        console.log("查询", res);
        this.tableData = JSON.parse(res.data).records;
        this.tableData.map((res) => {
          //   res.gmt_create = formatTimestamp(res.gmt_create);
          // res.sex = res.sex == 1? '男': res.sex == 2 ? '女' :"";
          // res.status = res.status == 1? '启用'
          //             :res.status == 2? '冻结' :"删除";
        });
        this.pageData.total = JSON.parse(res.data).total * 1;
        this.pageData.pageSize = JSON.parse(res.data).size;
        this.pageData.current = JSON.parse(res.data).current;
      });
    },
    openTreeList() {
      this.isQuery = true;
      this.treeVisible = true;
    },
    openTreeList2() {
      this.isQuery = false;
      this.treeVisible = true;
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
          if (this.isNew) {
            console.log("参数", this.editForm);
            this.$post("user", "save", this.editForm).then((res) => {
              console.log("add", res);
              this.$message({
                type: "success",
                message: res.msg,
              });
              this.reset();
              this.pageData.current = 1;
              this.getList();
              this.editFormVisible = false;
            });
          } else {
            this.$post("user", "update", this.editForm).then((res) => {
              this.$message({
                type: "success",
                message: res.msg,
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
      this.$refs["myForm"].resetFields();
    },
    addClick: function () {
      this.title = "新增";
      this.isNew = true;
      for (let x in this.editForm) {
        this.editForm[x] = "";
      }
      this.editFormVisible = true;
    },
    editClick: function (row) {
      this.title = "编辑";
      this.isNew = false;
      for (var x in this.editForm) {
        this.editForm[x] = row[x] || "";
      }
      this.editFormVisible = true;
    },
    removeData(row) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$post("user", "delete", { ids: row.id }).then((res) => {
            this.getList();
            this.$message({
              type: "success",
              message: res.msg,
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    setRole(row) {
      this.userId = row.id;
      this.$post("user", "listRoleByUser", {
        userId: row.id,
      }).then((res) => {
        this.userRoles = [];
        if (JSON.parse(res.data).length > 0) {
          for (let i in JSON.parse(res.data)) {
            this.userRoles.push(JSON.parse(res.data)[i].roleId);
          }
        }
      });
      this.rolesVisible = true;
    },
    editRoleSubmit() {
      this.$post("user", "roles", {
        userId: this.userId,
        roleIds: this.userRoles,
      }).then((res) => {
        this.$message({
          type: "success",
          message: res.msg,
        });
        this.getList();
        this.rolesVisible = false;
      });
    },
    exportUsers() {
      this.$downloadFile("用户信息.xls", "/platform-api/user/exportUsers", {
        name: this.queryItem.name,
        orgId: this.queryItem.orgId,
        beginDateScope: this.queryItem.beginDateScope,
        orderBy: this.queryItem.orderBy,
        isAsc: this.queryItem.isAsc,
      });
    },
    handleSuccess(response, file) {
      this.editForm.avatar = URL.createObjectURL(file.raw);
    },
    handleError(err, file, fileList) {
      this.$message.warning(`头像[${file.name}]上传失败`);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      if (isJPG && isLt2M) {
        let fileItems = [];
        fileItems.push(file);
        // this.$uploadFileRequest("/file/upload",formData).then((res)=>{
        this.$uploadFileRequest(
          "/file/upload",
          { test: 1 },
          fileItems,
          uploadCallback
        );
        var that = this;
        function uploadCallback(res) {
          that.$message.success(res.msg);
        }
      }
      return false;
    },
  },
  computed: {
    uploadHeader() {
      let headers = {};
      headers["x-auth-token"] = util.get("token");
      return headers;
    },
    actionURL() {
      return this.$config.baseUrl + "/file/upload";
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree_org.filter(val);
    },
  },
};
</script>
