<template>
  <div>
    <template v-if="items.children.length == 0">
      <el-menu-item :index="JSON.stringify(items)">
        <!-- <i v-if="items.value!='//'" class="el-icon-setting"></i><span>{{items.text.split(',')[0]}}</span> -->
        <i :class="items.icon" style="color: #4ae9fc;"></i> <span>{{items.title}}</span>
      </el-menu-item>
    </template>
    <template v-else>
      <el-submenu :index="JSON.stringify(items)">
        <template slot="title">
          <i :class="items.icon" style="color: #4ae9fc;"></i> <span>{{items.title}}</span>
          <span></span>
        </template>
        <mySubMenu v-for="(isItem,j) in items.children" :items="isItem" :key="j" >
        </mySubMenu>
      </el-submenu>
    </template>
  </div>
</template>

<script>
import mySubMenu from '@/components/menu/el_subMenu' // 引用组件
export default {
  name: 'mySubMenu',
  data () {
    return {

    }
  },
  mounted () {
    // console.log(this.items.nodes.length, this.items, '菜单栏接收数据')
  },
  methods: {
    Menuitemclick (subss) {
      // console.log(subss, '是否触发')
      this.$emit('Menuitemclick', subss)
    }
  },
  props: {
    items: {
      type: Object
    }
  },
  components: {
    mySubMenu
  }
}
</script>
<style scoped>
</style>