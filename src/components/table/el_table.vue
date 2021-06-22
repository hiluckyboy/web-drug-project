<template>
  <div class="">
    <el-table
      ref="singleTable"
      :data="tableData"
      style="width: 100%;"
      :max-height="this.list.height"
    >
      <el-table-column
        type="index"
        width="50"
        v-if="this.list.IsSerial"
        :index="indexMethod"
        label="序号"
      >
      </el-table-column>
      <!-- 主要表头 -->
      <template v-for="(item, i) in this.list.TableListThead">
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          :key="i"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <template
              v-if="
                typeof item.formatter != undefined &&
                typeof item.formatter != 'undefined'
              "
            >
              {{ comBackfuc(item.formatter, scope.row) }}
            </template>
            <template
              v-else-if="
                typeof item.scope != undefined &&
                typeof item.scope != 'undefined'
              "
            >
              <elTablescope
                v-bind:Ahtml="item.scope"
                v-bind:theRow="scope.row"
                v-bind:refName="'scope' + item.prop + scope.row.OwnGuid"
                @comBackfuc="comBackfuc"
                :ref="'scope' + item.prop + scope.row.OwnGuid"
              />
            </template>
            <template v-else>
              {{ scope.row[item.prop] }}
            </template>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        v-if="this.list.IsUseOperation == true"
        label="操作"
        prop="lalala"
        align="center"
      >
        <!-- 表头操作栏 -->
        <template slot-scope="scope">
          <template v-for="(item, i) in list.ExtraOperation">
            <span
              v-if="item.name != '删除'"
              :key="i"
              style="padding: 5px; color: #409eff; cursor: pointer;"
              @click="buttonMethods(item.click, scope.row)"
              >{{ item.name }}</span
            >
            <span
              v-else
              :key="i"
              style="padding: 5px; color: #f56c6c; cursor: pointer;"
              @click="buttonMethods(item.click, scope.row)"
              >{{ item.name }}</span
            >
          </template>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="typeof list.noPage == 'undefined' || list.noPage == true"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="
        typeof this.list.currentPage != 'undefined' &&
        typeof this.list.currentPage != undefined
          ? this.list.currentPage
          : currentPage
      "
      :page-sizes="
        typeof this.list.pageSizes != 'undefined' &&
        typeof this.list.pageSizes != undefined
          ? this.list.pageSizes
          : pageSizes
      "
      :page-size="
        typeof this.list.pageSize != 'undefined' &&
        typeof this.list.pageSize != undefined
          ? this.list.pageSize
          : pageSize
      "
      layout="total, sizes, prev, pager, next, jumper"
      :total="
        typeof this.list.thetotal != 'undefined' &&
        typeof this.list.thetotal != undefined
          ? this.list.thetotal
          : thetotal
      "
    >
    </el-pagination>
  </div>
</template>
<script>
import elTablescope from "@/components/table/el_table_scope"; // 引用组件
export default {
  components: {
    elTablescope,
  },
  props: {
    list: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tableData: [], // 表格-展示数据
      pageSizes: [10, 20, 30, 50], //
      pageSize: 10,
      thetotal: 0, // 表格总数
      currentPage: 1, // 显示第几页
    };
  },
  mounted() {
    console.log("获取传入参数", this.list);
    this.tableData = this.list.data;
  },
  methods: {
    // 序号
    indexMethod(index) {
      if (
        this.list.currentPage != undefined &&
        this.list.currentPage != "undefined"
      ) {
        return (this.list.currentPage - 1) * 10 + (index + 1);
      } else {
        return (this.currentPage - 1) * 10 + (index + 1);
      }
    },
    handleSizeChange(val) {
      // 改变每页数量 val
      let trueThis = this.FindTrueParent(this.$parent);
      if (
        this.list.pageSize != undefined &&
        this.list.pageSize != "undefined"
      ) {
        this.list.pageSize = val;
      } else {
        this.pageSize = val;
      }
      if (
        this.list.currentPage != undefined &&
        this.list.currentPage != "undefined"
      ) {
        this.list.currentPage = 1; // 显示页码也改为1
      } else {
        this.currentPage = 1; // 显示页码也改为1
      }

      this.$emit("handleSizeChange", val, trueThis); // 跳到第一页
    },
    handleCurrentChange(val) {
      let trueThis = this.FindTrueParent(this.$parent);
      // 点击跳转页码 val

      if (
        this.list.currentPage != undefined &&
        this.list.currentPage != "undefined"
      ) {
        this.list.currentPage = val;
      } else {
        this.currentPage = val;
      }
      this.$emit("handleCurrentChange", val, trueThis);
    },
    comBackfuc(funcName, row) {
      // 表中scope-formatter按钮 回调
      let methods = this.FindTrueParent(this.$parent).$options.methods;
      let trueThis = this.FindTrueParent(this.$parent);
      return methods[funcName](row, trueThis);
    },
    buttonMethods(funcName, row) {
      // 行尾按钮
      let methods = this.FindTrueParent(this.$parent).$options.methods;
      let trueThis = this.FindTrueParent(this.$parent);
      methods[funcName](row, trueThis);
    },
    FindTrueParent(methodsPage) {
      // 找到正确的父级页面，限制20层 // 限制会一直找到main页面层（略过el-form等含vue实例的父级不停下）
      for (var i = 0; i < 20; i++) {
        if (
          typeof methodsPage.$options.methods == "undefined" ||
          methodsPage.$el.className.indexOf("main") == -1
        ) {
          methodsPage = methodsPage.$parent;
        } else {
          return methodsPage;
        }
      }
      alert("未找到正确的父级页面！确认代码结构！");
    },
  },
};
</script>
<style scoped>
/* >>> .el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
>>> .el-table__body tr.current-row > td,
>>> .el-table__body tr.hover-row.current-row > td,
>>> .el-table__body tr.hover-row.el-table__row--striped.current-row > td,
>>> .el-table__body tr.hover-row.el-table__row--striped > td,
>>> .el-table__body tr.hover-row > td {
  background-color: transparent;
  color: #30e9ff;
} */
>>> .el-table {
  background: transparent;
  color: #000;
  /*padding: 0 20px;*/
}
>>> .el-table tr {
  background: transparent;
}
>>> .current-row {
  color: #000;
}
>>> .el-table--enable-row-hover .el-table__body tr:hover > td {
  color: #000;
}

>>> .el-pagination {
  width: 100%;
  text-align: center;
  padding: 10px 0;
}
>>> .el-pagination span {
  color: #000;
}
>>> .el-input__inner {
  background: transparent;
  color: #000;
}
>>> .el-input--mini .el-input__inner {
  height: 40px;
}
>>> .dialogRows .el-input__inner {
  color: #fff;
  width: 100%;
}
>>> .el-select {
  width: 100%;
}
>>> .el-range-input {
  background: transparent;
}
>>> .el-pagination button {
  background: transparent;
}
>>> .el-pagination .btn-next,
>>> .el-pagination .btn-prev {
  color: #000;
  background: transparent;
}
>>> .el-pager li {
  background: transparent;
  color: #000;
}
>>> .el-pager li.active {
  color: #4fc3ba;
}
>>> .el-pagination button:hover {
  color: #4fc3ba;
}
>>> .el-table,
>>> .el-table__expanded-cell {
  background-color: transparent;
}
>>> .el-table::before {
  height: 0;
}
</style>
