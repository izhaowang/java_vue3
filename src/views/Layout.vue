<script lang="ts" setup>
import { reactive } from "vue";
import {
  Document,
  Memo,
  User,
  Setting,
  Management,
  Promotion,
  UserFilled,
  Crop,
  EditPen,
  SwitchButton,
  CaretBottom,
} from "@element-plus/icons-vue";

import userApi from "@/api/user.js";
import { useUserInfoStore } from "@/stores/userInfo.js";
import avatar from "@/assets/avatar.jpg";
const { userInfo } = userApi;

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

const userInfoStore = useUserInfoStore();
const getUserInfo = async () => {
  let res = await userInfo();
  userInfoStore.setUserInfo(res.data);
};
getUserInfo();
import { useRouter } from "vue-router";
const router = useRouter();
import { ElMessage, ElMessageBox } from "element-plus";
import { useTokenStore } from "@/stores/token.js";
const tokenStore = useTokenStore();
const handleCommand = (command) => {
  console.log(command);

  if (command === "logout") {
    //退出登录
    ElMessageBox.confirm("你确认退出登录码？", "温馨提示", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        //用户点击了确认
        //清空pinia中的token和个人信息
        userInfoStore.info = {};
        tokenStore.token = "";
        //跳转到登录页
        router.push("/login");
      })
      .catch(() => {
        //用户点击了取消
        ElMessage({
          type: "info",
          message: "取消退出",
        });
      });
  } else {
    //路由
    router.push("/user/" + command);
  }
};
const goBOke = () => {
  window.open("https://izhaowang.github.io/", "_blank");
};
</script>
<template>
  <div class="common-layout">
    <el-container class="container">
      <el-aside class="aside">
        <div class="el-aside__logo" @click="goBOke"></div>
        <el-menu
          class="aside_menu"
          default-active="/article/category"
          @open="handleOpen"
          @close="handleClose"
          router
          background-color="#232323"
          text-color="#fff"
        >
          <el-menu-item index="/article/category">
            <el-icon><Memo /></el-icon>
            <span>文章分类</span>
          </el-menu-item>
          <el-menu-item index="/article/manage">
            <el-icon><Document /></el-icon>
            <span>文章管理</span>
          </el-menu-item>
          <el-sub-menu index="">
            <template #title>
              <el-icon><User /></el-icon>
              <span>个人中心</span>
            </template>
            <el-menu-item-group title="" index="">
              <el-menu-item index="/user/avatar">用户头像</el-menu-item>
              <el-menu-item index="/user/info">用户信息</el-menu-item>
              <el-menu-item index="/user/resetPassword">
                <el-icon><Setting /></el-icon>
                <span>重置密码</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <el-header>
          <div>
            <strong>{{
              userInfoStore.userInfo.nickname
                ? userInfoStore.userInfo.nickname
                : userInfoStore.userInfo.username
            }}</strong>
          </div>
          <el-dropdown placement="bottom-end" @command="handleCommand">
            <span class="el-dropdown__box">
              <el-avatar :src="avatar" />
              <el-icon>
                <CaretBottom />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="info" :icon="User">基本资料</el-dropdown-item>
                <el-dropdown-item command="avatar" :icon="Crop"
                  >更换头像</el-dropdown-item
                >
                <el-dropdown-item command="resetPassword" :icon="EditPen"
                  >重置密码</el-dropdown-item
                >
                <el-dropdown-item command="logout" :icon="SwitchButton"
                  >退出登录</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-header>
        <el-main class="main_content">
          <router-view> </router-view>
        </el-main>
        <el-footer>大事件 ©2023 Created by 黑马程序员</el-footer>
      </el-main>
    </el-container>
  </div>
</template>
<style lang="scss" scoped>
.common-layout {
  height: 100%;
  .container {
    height: 100%;
    width: 100%;
    .el-aside {
      background-color: #232323;

      &__logo {
        height: 120px;
        background: url("@/assets/logo.png") no-repeat center / 120px 100%;
      }

      .el-menu {
        border-right: none;
      }
    }

    .main {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      height: 100%;
    }
    .main_content {
      height: 100%;
      width: 100%;
    }
  }

  .el-header {
    width: 100%;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .el-dropdown__box {
      display: flex;
      align-items: center;

      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }

  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>
