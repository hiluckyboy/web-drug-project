<template>
  <div class="background">
    <el-form
      :model="form"
      :rules="rules"
      ref="loginForm"
      label-position="left"
      label-width="0px"
      class="demo-loginForm login-container"
    >
      <h3 class="title">系统登录</h3>
      <el-form-item prop="username">
        <el-input
          type="text"
          v-model="form.username"
          size="medium"
          auto-complete="off"
          placeholder="请输入账号"
        >
          <!--                   <span slot="prepend" class="fa fa-user fa-lg"></span>-->
          <span slot="prepend" class="iconfont" style="color: #cac6c6"
            >&#xe7e6;</span
          >
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          v-model="form.password"
          size="medium"
          auto-complete="off"
          placeholder="请输入密码"
          @keyup.enter.native="handleSubmit"
        >
          <!--                    <span slot="prepend" class="fa fa-lock fa-lg"></span>-->
          <span slot="prepend" class="iconfont" style="color: #cac6c6"
            >&#xe620;</span
          >
        </el-input>
      </el-form-item>
      <!-- <el-form-item v-show="verifyImageFlag">
                <el-row>
                    <el-col :span="12">
                        <el-input v-model="form.verifyCode"
                                  type="text"
                                  size="medium"
                                  auto-complete="false"
                                  placeholder="验证码"
                        ></el-input>
                    </el-col>
                    <el-col style="text-align: center;line-height: 40px;" :span="8">
                        <img :src="verifyImageUrl" width="80px" height="35px" alt=""/>
                    </el-col>
                    <el-button :loading="verifyCodeLoading"
                               @click.native.prevent="getVerifyCode"
                               size="medium"
                               type="text"
                    >换一张</el-button>
                </el-row>
            </el-form-item> -->
      <el-form-item style="width: 100%">
        <el-button
          type="primary"
          style="width: 100%"
          size="medium"
          @click.native.prevent="handleSubmit"
          :loading="logining"
          class="login_btn"
          >登录</el-button
        >
      </el-form-item>
      <!-- <div class="login_btn" @click.native.prevent="handleSubmit">登录</div> -->
    </el-form>
  </div>
</template>
<script>
import util from "../util/util";
import { path } from "../util/path";
export default {
  data() {
    // let verifyCodeValidator = (rule, value, callback) => {
    //     if (!this.verifyImageFlag)
    //         return callback();
    //     if (!value)
    //         return callback(new Error("请输入验证码"));
    //     return callback();
    // };
    return {
      logining: false,
      form: {
        username: "",
        password: "",
        // verifyCode: ''
      },
      rules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        // verifyCode: [
        //     {validator: verifyCodeValidator, trigger: 'blur'}
        // ]
      },
      checked: true,
      verifyImageFlag: false,
      verifyImageUrl: "",
      // verifyCodeLoading: false,
      // verifyKey: ''
    };
  },
  mounted() {
    // this.getVerifyCode();
  },
  methods: {
    // getVerifyCode() {
    //     this.getKey(this.getVerifyConfig);
    // },
    getKey(callback) {
      let RSAKey = util.get("loginKey");
      let randomKey = util.get("loginRandomKey");
      let data = {};
      if (randomKey && randomKey != "null") data = { key: randomKey };
      this.$postForKey("login", "getKey", data).then((res) => {
        if (res.status == 200) {
          if (res.data.code == 200) {
            let ret = res.data;
            RSAKey = ret.data.pk;
            randomKey = ret.data.uuid;
            util.set("loginKey", RSAKey);
            util.set("loginRandomKey", randomKey);
            callback(RSAKey, randomKey);
          } else {
            this.$message.error("网络错误：" + res.status);
          }
        } else {
          this.$message.error("网络错误：" + res.status);
        }
      });
    },
    handleReset() {
      this.$refs.loginForm.resetFields();
    },
    handleSubmit(ev) {
      // this.$refs.loginForm.validate((valid) => {
      //   if (valid) {
      //     this.getKey(this.login);
      //   }
      // });
        this.$router.push({
            path:"/system"
        })
    },
    login(RSAKey, randomKey) {
      let loading = this.$loading({ fullscreen: true });
      let data = {
        username: this.form.username.toLowerCase(),//转换为小写
        password: this.form.password.toLowerCase(),//转换为小写
        // verifyCode: this.form.verifyCode
      };
      this.$postForLogin("login", "login", data, RSAKey, randomKey)
        .then((res) => {
          loading.close();
          if (res.status == 200) {
            let ret = res.data;
            if (ret.code == 200) {
              // 从请求头取出token
              let token = res.headers["x-auth-token"];
              let remember = res.headers["x-auth-remember"];
              let loginUser = ret.data;
              loginUser.token = token;
              loginUser.remember = remember;
              console.log(loginUser);
              // 存储token
              util.set("token", token);
              util.set("remember", remember);
              util.set("rsaKey", loginUser.publicKey);
              this.$store.commit("login", loginUser);
              //this.$store.state.user;
              loading = this.$loading({ fullscreen: true });
              // let params={
              //     type:1
              // };
              this.$get("menu", "init")
                .then((res) => {
                  loading.close();
                  localStorage.setItem("routes", JSON.stringify(res.data));
                  let menuList = util.formatRoutes(JSON.parse(res.data));
                  this.$router.addRoutes(menuList);
                  console.log(this.$router,'是否添加路由')
                  this.$store.commit("initMenu", menuList);
                  this.$router.push({
                    path: "/",
                  });
                })
                .catch((res) => {
                  loading.close();
                });
            } else {
              // this.getVerifyCode();
              loading.close();
              this.$message.error(ret.msg || "登录错误");
            }
          } else {
            // this.getVerifyCode();
            loading.close();
            this.$message.error("网络错误：" + res.status);
          }
        })
        .catch((res) => {
          // this.getVerifyCode();
          loading.close();
        });
    },
  },
};
</script>

<style scoped>
.login-container .title {
  margin: 0 auto 40px auto;
  text-align: center;
  color: #505458;
}
.login-container {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 0 auto 0 auto !important;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.background {
  width: 100%;
  height: 100%;
  /*background-image: url('../assets/login_bg.jpg');*/
  position: absolute;
    display:flex;
    align-items: center;
}

.login-tip {
  text-align: center;
  color: #ff5151;
}

.el-input-group__prepend {
  padding: 0 15px;
  color: #505458 !important;
}

.logo {
  width: 407px;
  height: 145px;
  position: relative;
  margin: 180px auto 0 auto !important;
}

.fa-user {
  width: 20px;
  height: 20px;
  background:#fff;
  position: relative;
}
</style>
