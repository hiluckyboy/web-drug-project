<template>
  <div v-html="Ahtml">
  </div>
</template>

<script>
export default {
  name: 'el_table_scope',
  props: ['Ahtml', 'theRow', 'refName'],
  // mounted () {
  // console.log(this.Ahtml, this.theRow)
  // },
  created () {
    try {
      const compiler = require('vue-template-compiler') // 适配 vue-template-compiler v2.6.11
      var res = compiler.compileToFunctions(this.Ahtml) // 直接返回render实例
      this.$options.render = res.render
      this.$options.staticRenderFns = res.staticRenderFns
    } catch (err) {
      console.log(err)
    }
  },
  methods: {
    buttonMethods (funcName, row, extraParameter) { // 行尾按钮
      // console.log(this.refName)
      console.log('表中 监听', funcName, row, this.refName, extraParameter)
      this.$emit('comBackfuc', funcName, row, this.refName, extraParameter)
    }
  }
}
</script>

<style scoped>
</style>
