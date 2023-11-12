<script setup>
import { ref, reactive } from "vue";
import { User, Lock, Back, Right } from "@element-plus/icons-vue";
import userApi from "@/api/user.js";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useTokenStore } from "@/stores/token.js";
const { userLogin, userRegister } = userApi;
const isRegister = ref(false);

const user = reactive({
  username: "",
  password: "",
  repassword: "",
});
const validatePass = (rule, value, callback) => {
  console.log(value);
  if (value === "") {
    callback(new Error("重复输入密码不能为空"));
  } else if (value !== user.password) {
    callback(new Error("两次输入密码不一致！"));
  } else {
    callback();
  }
};
const Regrules = reactive({
  username: [
    { required: true, message: "输入用户名", trigger: "blur" },
    { min: 5, max: 16, message: "长度是5-16", trigger: "blur" },
  ],
  password: [
    { required: true, message: "输入密码", trigger: "blur" },
    { min: 5, max: 16, message: "长度是5-16", trigger: "blur" },
  ],
  repassword: [{ validator: validatePass, trigger: "blur" }],
});
const goRegister = function () {
  isRegister.value = !isRegister.value;
  user.username = "";
  user.password = "";
  user.repassword = "";
};
const toRegister = async function () {
  const res = await userRegister(user);
  console.log(res);
  ElMessage.success(res.message ? res.message : "注册成功");
};
const router = useRouter();
const toLogin = async function () {
  const tokenStore = useTokenStore();
  const res = await userLogin(user);
  console.log(res);
  tokenStore.setToken(res.data);
  ElMessage.success(res.message ? res.message : "登录成功");

  router.push("/");
};
</script>

<template>
  <div class="content">
    <div v-if="isRegister">
      <el-form :rules="Regrules" :model="user">
        <el-form-item label="" prop="username">
          <el-input
            v-model="user.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
            class="item"
          />
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input
            v-model="user.password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            class="item"
          />
        </el-form-item>
        <el-form-item label="" prop="repassword">
          <el-input
            v-model="user.repassword"
            placeholder="请再次输入密码"
            :prefix-icon="Lock"
            class="item"
          />
        </el-form-item>
        <el-form-item>
          <el-button class="btn" type="primary" @click="toRegister">注册</el-button>
        </el-form-item>
        <el-form-item>
          <Back style="width: 1em; height: 1em; margin-right: 8px" />
          <el-text class="mx-1" @click="goRegister">返回</el-text>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="!isRegister">
      <el-form :rules="Regrules" :model="user">
        <el-form-item label="" prop="username">
          <el-input
            v-model="user.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
            class="item"
          />
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input
            v-model="user.password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            class="item"
          />
        </el-form-item>

        <el-form-item>
          <el-button class="btn" type="primary" @click="toLogin">登录</el-button>
        </el-form-item>
        <el-form-item>
          <Right style="width: 1em; height: 1em; margin-right: 8px" />
          <el-text class="mx-1" @click="goRegister">注册</el-text>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.content {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: url("@/assets/bgc.jpg");

  div {
    width: 300px;
    .btn {
      width: 100%;
    }
    .item {
      height: 40px;
      line-height: 40px;
    }
    .mx-1 {
      cursor: pointer;
    }
  }
}
</style>
