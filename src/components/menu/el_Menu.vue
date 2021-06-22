<template>
  <div class="main" style="display: flex; align-items: center; width: 100%">
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c6400"
      text-color="#fff"
      active-text-color="#ffd04b"
      :default-active="JSON.stringify(activeIndex)"
      style="display: flex; justify-content: space-around; width: 100%"
    >
      <div v-for="(item, i) in MenuInfo" :key="i">
        <template v-if="item.children.length == 0">
          <el-menu-item :index="JSON.stringify(item)">
            <template>
              <!-- <i v-if="item.value!='//'" class="el-icon-setting"></i><span>{{item.text.split(',')[0]}}</span> -->
              <i class="iconfont" :class="item.icon" style="color: #4ae9fc"></i>
              <span>{{ item.title }}</span>
            </template>
          </el-menu-item>
        </template>
        <template v-else>
          <el-submenu :index="JSON.stringify(item)">
            <template slot="title">
              <i class="iconfont" :class="item.icon" style="color: #4ae9fc"></i>
              <span>{{ item.title }}</span>
              <!-- <p
                v-if="
                  typeof activeIndex.fisTitle != undefined &&
                  typeof activeIndex.fisTitle != 'undefined' &&
                  activeIndex.fisTitle == item.title
                "
                style="
                  text-align: center;
                  font-size: 12px;
                  margin: 0px;
                  line-height: 0px;
                "
              >
                ({{ activeIndex.title }})
              </p> -->
            </template>
            <elsubMenu
              v-for="(items, j) in item.children"
              :items="items"
              :key="j"
            ></elsubMenu>
          </el-submenu>
        </template>
      </div>
    </el-menu>
  </div>
</template>

<script>
import elsubMenu from "@/components/menu/el_subMenu"; // 引用组件
import { path } from "../../util/path";
export default {
  props: {
    MenuInfo: {
      type: Array,
    },
    active: { type: String },
    activePath: { type: String },
  },
  components: {
    elsubMenu,
  },
  data() {
    return {
      activeIndex: "undefined",
    };
  },
  created() {
    // this.updateMenuInfo();
    this.updateActive();
  },
  mounted() {
  },
  methods: {
    // updateMenuInfo() {
    //   this.MenuInfo.forEach((Response) => {
    //     if (Response.children.length != 0) {
    //       let title = Response.title;
    //       function menuBiFun(rows, title) {
    //         for (let i = 0; i < rows.length; i++) {
    //           if (rows[i].children.length != 0) {
    //             menuBiFun(rows[i].children, title);
    //           } else {
    //             rows[i]["fisTitle"] = title;
    //           }
    //         }
    //       }
    //       menuBiFun(Response.children, title);
    //     }
    //   });
    //   console.log(this.MenuInfo);
    // },
    updateActive() {
      if (
        this.pathListFun(this.MenuInfo, this.activePath) != undefined &&
        this.pathListFun(this.MenuInfo, this.activePath) != "undefined"
      ) {
        this.activeIndex = this.pathListFun(this.MenuInfo, this.activePath);
        this.$emit('setTitle',this.activeIndex)
      } else {
        this.activeIndex = "undefined";
      }
    },
    handleSelect(key, keyPath) {
      let trueThis = this.FindTrueParent(this.$parent);
      this.$emit("go_link", key, trueThis, this.active);
    },
    pathListFun(data, pos) {
      let pathShow;
      function biBaoFun(rows) {
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].children.length != 0) {
            biBaoFun(rows[i].children);
          } else {
            if (pos == rows[i].path) {
              pathShow = rows[i];
            }
          }
        }
      }
      biBaoFun(data);
      return pathShow;
    },
    FindTrueParent(methodsPage) {
      // 找到正确的父级页面，限制20层 // 限制会一直找到main页面层（略过el-form等含vue实例的父级不停下）
      for (var i = 0; i < 20; i++) {
        if (
          typeof methodsPage.$options.methods == "undefined" ||
          methodsPage.$el.className != "kanBanContent view_index main"
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.el-menu--horizontal {
  border-bottom: none !important;
  display: flex;
}
.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: none;
}
.el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
  border-bottom: none;
}
.el-menu-demo .el-menu-item:not(.is-disabled):focus,
.el-menu-demo .el-menu-item:not(.is-disabled):hover {
  background-color: #057dc100 !important;
  color: #ffd04b !important;
}
.el-menu--popup .el-menu-item:not(.is-disabled):focus,
.el-menu--popup .el-menu-item:not(.is-disabled):hover {
  background-color: #057dc1 !important;
  color: #ffd04b !important;
}
.el-menu--popup .el-submenu__title:focus,
.el-menu--popup .el-submenu__title:hover {
  outline: 0;
  background-color: #057dc100 !important;
  color: #ffd04b !important;
}
.el-submenu__title:focus,
.el-submenu__title:hover {
  outline: 0;
  background-color: #057dc100 !important;
  color: #ffd04b !important;
}
.el-menu--popup {
  background-color: #036399 !important;
}
.el-menu-item {
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  padding: 0;
}
.el-menu--horizontal > .el-menu-item {
  height: 50px !important;
  line-height: 50px  !important;
}
.el-menu--horizontal > .el-submenu .el-submenu__title {
  height: 50px  !important;
  line-height: 50px  !important;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
}
.el-submenu__title {
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  /* padding: 0; */
}
</style>
