<script setup>
import { ref } from "vue";
import { useUserInfoStore } from "@/stores/userInfo";
import userApi from "@/api/user";
import { ElMessage } from "element-plus";
const { editUserInfo, updatePwdServer } = userApi;
const userInfoStore = useUserInfoStore();
const userInfo = ref({
  old_pwd: "",
  new_pwd: "",
  re_pwd: "",
});
const validatePass = (rule, value, callback) => {
  console.log(value);
  if (value === "") {
    callback(new Error("重复输入密码不能为空"));
  } else if (value !== userInfo.value.new_pwd) {
    callback(new Error("两次输入密码不一致！"));
  } else {
    callback();
  }
};
const rules = {
  old_pwd: [
    { required: true, message: "请输入用户密码", trigger: "blur" },
    {
      pattern: /^\S{5,16}$/,
      message: "密码必须是5-16位的非空字符串",
      trigger: "blur",
    },
  ],
  new_pwd: [
    { required: true, message: "请输入用户新密码", trigger: "blur" },
    {
      pattern: /^\S{5,16}$/,
      message: "密码必须是5-16位的非空字符串",
      trigger: "blur",
    },
  ],
  re_pwd: [{ validator: validatePass, trigger: "blur" }],
};
const updatePwd = async () => {
  let res = await updatePwdServer(userInfo.value);
  ElMessage.success(res.message ? res.message : "修改成功");
};
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>基本资料</span>
      </div>
    </template>
    <el-row>
      <el-col :span="12">
        <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
          <el-form-item label="旧密码" prop="old_pwd">
            <el-input v-model="userInfo.old_pwd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="new_pwd">
            <el-input v-model="userInfo.new_pwd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="重复新密码" prop="re_pwd">
            <el-input v-model="userInfo.re_pwd" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updatePwd">提交修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>
