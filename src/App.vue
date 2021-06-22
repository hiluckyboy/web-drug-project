<template>
	<div id="app">
		<transition name="fade" mode="out-in">
			<router-view v-if="isRouterAlive"></router-view>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'app',
	components: {
	},
	provide(){
        return{
			reload:this.reload
		}
	},
	data(){
         return{
			 isRouterAlive:true
		 } 
	},
	methods:{
       reload(){
		   this.isRouterAlive = false
		   this.$nextTick(function (){
			   this.isRouterAlive = true
		   })
	   }
	},
	mounted(){

	}
}

</script>

<style>
html,body {
	margin: 0;
	padding: 0;
	font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
	font-size: 14px;
	-webkit-font-smoothing: antialiased;
    width: 100%;
    height: 100%;
    background: #00CCCC;
}

#app {
	position: absolute;
	top: 0;
	bottom: 0;
	width: 100%;
	overflow: hidden;
}
ul{
    margin: 0;
    padding: 0;
}
ul li{
    list-style-type: none;
}

.el-submenu [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.el-menu-item [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.toolbar .el-form-item {
	margin-bottom: 10px;
}
.toolbar {
	background: #f2f2f2;
	padding: 10px;
	margin: 10px 0px;

}

.fade-enter-active,
.fade-leave-active {
	transition: all .2s ease;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
}
</style>
