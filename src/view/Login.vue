<template>
  <div>
    <el-container>
      <el-main>
        <el-card class="login_card">
          <div class="login_title">
            欢迎登录安徽中烟AI问答机器人管理后台
          </div>
          <el-form :model="form" :rules="rules" ref="ruleFormRef" label-width="80px">
            <el-form-item label="" prop="username">
              <el-input v-model="form.username" placeholder="请输入登录用户名" :prefix-icon="Avatar" size="large" />
            </el-form-item>
            <el-form-item label="" prop="password">
              <el-input type="password" placeholder="请输入登录密码" v-model="form.password" :prefix-icon="Lock" size="large" show-password />
            </el-form-item>
            <el-form-item style="margin-top: 40px">
              <el-button type="primary" @click="onSubmit()" size="large" @keyup.enter="onSubmit()">登录</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import userApi from "../api/user";
import { reactive, ref, getCurrentInstance } from "vue";
import { ElMessage } from "element-plus";
import router from "../router/index";
import { Lock, Avatar } from '@element-plus/icons-vue'
const { proxy } = getCurrentInstance();
const form = reactive({
  username: "",
  password: "",
});
const ruleFormRef = ref();
const rules = reactive({
  username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  password: [{ required: true, message: "密码不能为空", trigger: "blur" }],
});
const onSubmit = () => {
  if (!ruleFormRef) return;
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      const res = await userApi.login(form);
      if (res.data) {
        if (res.data.accessToken) {
          let Data = Object.assign({ name: 'token', val: res.data.accessToken }, { startTime: new Date().getTime() },{ endTime: res.data.expiresTime });
          localStorage.setItem("token", JSON.stringify(Data));
          // proxy.$commonJs.changeView('/home');
          router.push("/home");
        } else {
          ElMessage.error(res.data.msg);
        }
      } else {
        ElMessage.error(res.msg);
      }
    } else {
      return false;
    }
  });
};
const resetForm = () => {
  if (!ruleFormRef) return;
  ruleFormRef.value.resetFields();
};
</script>

<style scoped>
.el-main {
  height: 100%;
}

button {
  width: 100%;
}

:deep .el-form-item__content {
  margin-left: 0px !important;
}

.login_title {
  background: url("../assets/img/logo.png") no-repeat left center;
  height: 35px;
  line-height: 35px;
  padding-left: 45px;
  font-size: 24px;
  color: #000;
  background-size: 35px 35px;
  font-weight: bold;
  text-align: center;
  width: 440px;
  margin: 0 auto
}



.login_card {
  width: 700px;
  height: 100%;
  border-radius: 6px;
  margin: 40px auto;
  padding-top: 50px;
  margin-top: 100px;
}

.el-form {
  margin: 0 auto;
  width: 340px;
  margin-top: 40px;
}

.el-form-item {
  margin-bottom: 25px;
}</style>
