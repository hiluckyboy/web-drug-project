<template>
  <div>
    <el-row type="flex" justify="space-between">
      <el-col>
        <el-row type="flex" justify="start">
          <el-form :inline="true" ref="queryForm" :model="queryForm">
            <el-form-item label="名称">
              <el-input
                v-model="queryForm.name"
                size="mini"
                placeholder="名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="编码">
              <el-input
                v-model="queryForm.code"
                size="mini"
                placeholder="编码"
              ></el-input>
            </el-form-item>
            <el-form-item label="类型">
              <el-select
                value-key="num"
                size="mini"
                v-model="queryForm.type"
                placeholder="类型"
              >
                <el-option
                  v-for="item in roleType"
                  :key="item.num"
                  :label="item.name"
                  :value="item.num"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="getList"
                >查询</el-button
              >
              <el-button
                type="primary"
                icon="el-icon-refresh"
                size="mini"
                @click="queryFormReset"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
        </el-row>
      </el-col>
    </el-row>
    <el-row type="flex" justify="end" style="margin-bottom: 5px">
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-plus"
        @click="addClick"
        >新增</el-button
      >
    </el-row>
    <el-table
      row-key="id"
      :data="tableData"
      @current-change="selectRow"
      highlight-current-row
    >
      <el-table-column prop="name" label="名称" width="180" align="center">
      </el-table-column>
      <el-table-column prop="code" label="编码" align="center">
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        align="center"
        :formatter="typeFormatter"
      >
      </el-table-column>
      <el-table-column
        prop="description"
        label="备注"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="operation" label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="authClick(scope.row.id)"
            >授权</el-button
          >
          <el-button type="text" @click="editClick(scope.row)">编辑</el-button>
          <el-button type="text" @click="removeData(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <el-pagination
        style="float: right"
        @size-change="sizeChange"
        @current-change="pageChange"
        :current-page="pageData.pageIndex"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        size="small"
        :total="pageData.total"
      >
      </el-pagination>
    </el-row>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="editFormVisible"
      @close="onEditClose"
      :close-on-click-modal="false"
    >
      <el-form
        style="width: 80%; margin: auto"
        :model="editForm"
        label-width="80px"
        :rules="editFormRules"
        ref="myForm"
        label-position="right"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="editForm.code" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select
            value-key="num"
            v-model="editForm.type"
            placeholder="请选择类型"
          >
            <el-option
              v-for="item in roleType"
              :key="item.num"
              :label="item.name"
              :value="item.num"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="tips">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            resize="none"
            v-model="editForm.description"
            auto-complete="off"
          ></el-input>
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

    <el-dialog
      title="授权"
      :visible.sync="authFormVisible"
      @close="onAuthClose"
      :close-on-click-modal="false"
    >
      <el-tree
        ref="authTree"
        style="width: 80%; margin: auto auto auto auto"
        node-key="id"
        :default-checked-keys="tree.defaultCheck"
        :default-expanded-keys="tree.defaultExpanded"
        :filter-node-method="filterTreeNode"
        :data="tree.data"
        :props="tree.props"
        highlight-current
        check-on-click-node
        show-checkbox
        @node-click="getclick"
      ></el-tree>
      <div slot="footer">
        <el-button size="mini" @click.native="authFormVisible = false"
          >取消</el-button
        >
        <el-button
          size="mini"
          type="primary"
          @click.native="authSubmit"
          :loading="editLoading"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import util from "../../util/util";
export default {
  name: "Role",
  inject: ["reload"],
  data() {
    return {
      dialogTitle: "编辑",
      row: "",
      isNew: true,
      queryForm: {
        name: "",
        code: "",
        type: "",
      },
      roleType: [],
      tableData: [],
      dataTemp: [],
      pageData: {
        pageIndex: 1,
        total: 0,
        pageSize: 10,
      },
      editFormRules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { max: 32, message: "名称长度不能超过32", trigger: "blur" },
        ],
        code: [
          { required: true, message: "请输入编码", trigger: "blur" },
          { max: 32, message: "编码长度不能超过32", trigger: "blur" },
          {
            pattern: /^[0-9a-zA-Z_]{0,32}$/,
            message: "编码只能包含数字字母下划线，长度不能超过32",
            trigger: "blur",
          },
        ],
        type: [{ required: true, message: "请选择类型", trigger: "blur" }],
        description: [
          { max: 255, message: "描述长度不能超过255", trigger: "blur" },
        ],
      },
      editForm: {
        name: "",
        code: "",
        type: "",
        description: "",
      },
      editLoading: false,
      editFormVisible: false,
      authFormVisible: false,
      tree: {
        defaultCheck: [],
        defaultExpanded: [],
        roleId: -1,
        data: [],
        props: {
          label: "title",
          children: "children",
        },
      },
    };
  },
  created() {
    this.getList();
    this.getRoleType();
  },
  methods: {
    getList() {
      let queryData = this.queryForm;
      let page = this.pageData;
      queryData = Object.assign(queryData, page);
      delete queryData.total;
      this.$post("role", "page", queryData)
        .then((res) => {
          this.tableData = JSON.parse(res.data).records;
          this.pageData.total = Number(JSON.parse(res.data).total);
        })
        .catch((res) => {});
    },
    getRoleType() {
      this.$post("role", "getRoleType")
        .then((res) => {
          if (res.code == 200) {
            this.roleType = JSON.parse(res.data);
          } else {
            this.$message.error(res.msg || "查询角色类型失败！");
          }
        })
        .catch((res) => {});
    },
    queryFormReset() {
      for (let x in this.queryForm) {
        this.queryForm[x] = "";
      }
      this.getList();
    },
    pageChange(current) {
      this.pageData.pageIndex = current;
      this.getList();
    },
    sizeChange(current) {
      this.pageData.pageSize = current;
      this.getList();
    },
    selectRow(row, oldRow) {
      this.row = row;
    },
    getclick() {
      console.log("getCheckedKeys", this.$refs.authTree.getHalfCheckedKeys());
    },
    authSubmit() {
      // 保存权限方法
      let authData = [];
      authData.push(...this.$refs.authTree.getCheckedKeys());
      authData.push(...this.$refs.authTree.getHalfCheckedKeys());
      let roleId = this.tree.roleId;
      let loading = this.$loading({ fullscreen: true });
      console.log("authData123", authData);
      console.log("roleId", roleId);
      this.$post("role", "auth", { roleId: roleId, menuIds: authData })
        .then((res) => {
          loading.close();
          console.log("resss", res);
          if (res && res.code == 200) {
            this.authFormVisible = false;
          } else {
            this.$message.error(res.msg || "授权失败");
          }
          //   window.location.reload();
          //this.$router.go(0)
          this.reload();
        })
        .then(() => {
          this.$get("menu", "init").then((res) => {
            loading.close();

            localStorage.removeItem("routes");
            localStorage.setItem("routes", JSON.stringify(res.data));
            console.log(JSON.parse(JSON.parse(localStorage.getItem("routes"))));
            let menuList = util.formatRoutes(JSON.parse(res.data));
            this.$router.addRoutes(menuList);
            // console.log(this.$router)
            this.$store.commit("initMenu", menuList);
          });
        })
        .catch((res) => {
          loading.close();
        });
    },
    editSubmit() {
      // 保存角色方法
      this.$refs["myForm"].validate((valid) => {
        if (!valid) {
          return;
        }
        let data = this.editForm;
        let operation = "add";
        if (data.id) {
          operation = "update";
        }
        console.log("data666", data);
        let loading = this.$loading({ fullscreen: true });
        this.$post("role", operation, data)
          .then((res) => {
            loading.close();
            if (res.code == 200) {
              this.queryForm = {};
              this.pageData = { pageIndex: 1, pageSize: 10 };
              this.getList();
              this.$message.success("操作成功");
              this.editFormVisible = false;
            } else {
              this.$message.error(res.msg || "操作失败");
            }
          })
          .catch((res) => {
            loading.close();
          });
      });
    },
    onEditClose() {
      this.$refs.myForm.resetFields();
      for (let x in this.editForm) {
        this.editForm[x] = "";
      }
    },
    addClick: function () {
      this.dialogTitle = "新增";
      this.editFormVisible = true;
    },
    editClick: function (row) {
      this.row = row;
      if (!this.row.id) {
        this.$message({
          type: "error",
          message: "请先选中一条记录",
        });
        return;
      }
      let data = Object.assign({}, row);
      data.type = Number(data.type);
      this.editForm = data;
      this.dialogTitle = "编辑";
      this.editFormVisible = true;
    },
    removeData(row) {
      if (!row) {
        this.$message({
          type: "error",
          message: "请先选中一条记录",
        });
        return;
      }
      this.$confirm("确认要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let loading = this.$loading({ fullscreen: true });
        this.$post("role", "delete", { ids: row.id })
          .then((res) => {
            loading.close();
            if (res.code == 200) {
              this.$message.success("操作成功");
              this.getList();
            } else {
              this.$message.error(ret.msg || "删除失败");
            }
          })
          .catch((res) => {
            loading.close();
          });
      });
    },
    authClick(roleId) {
      if (!roleId) {
        this.$message.error("请选择一条记录！");
        return;
      }
      this.tree.roleId = roleId;
      let loading = this.$loading({ fullscreen: true });
      this.$post("role", "getAuth", { roleId: roleId })
        .then((res) => {
          loading.close();
          if (res.code == 200) {
            this.tree.data = JSON.parse(res.data).menu;
            this.tree.defaultCheck = JSON.parse(res.data).auth;
            this.tree.defaultExpanded = JSON.parse(res.data).auth;
            this.authFormVisible = true;
          } else {
            this.$message.error(res.message || "授权查询出错");
          }
        })
        .catch((res) => {
          loading.close();
        });
    },
    onAuthClose() {
      this.tree.data = [];
      this.tree.defaultCheck = [];
      this.tree.defaultExpanded = [];
    },
    typeFormatter(row, column, cellValue, index) {
      if (cellValue) {
        for (let i = 0; i < this.roleType.length; i++) {
          if (this.roleType[i].num == cellValue) {
            return this.roleType[i].name;
          }
        }
      }
    },
    filterTreeNode() {},
  },
  watch: {},
};
</script>

<style scoped>
>>> .el-select {
  width: 100%;
}
</style>
