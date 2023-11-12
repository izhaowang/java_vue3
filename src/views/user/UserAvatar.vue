<script setup>
import { Plus, Upload } from "@element-plus/icons-vue";
import { ref } from "vue";
import avatar from "@/assets/default.png";
import { useUserInfoStore } from "@/stores/userInfo.js";
import { useTokenStore } from "@/stores/token";
import { ElMessage } from "element-plus";
import userApi from "@/api/user";
const { updataAvatarServer } = userApi;
const userInfoStore = useUserInfoStore();
// const imgUrl = ref(userInfoStore.userInfo.userPic);
const uploadRef = ref();
const tokenStore = useTokenStore();
const uploadSuccess = (result) => {
  //
  console.log(result);
  ElMessage.success("上传成功");
};
const updataAvatar = () => {
  // 需要调用修改头像接口 updataAvatarServer
  ElMessage.success("上传成功");
};
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>更换头像</span>
      </div>
    </template>
    <el-row>
      <el-col :span="12">
        <el-upload
          ref="uploadRef"
          :auto-upload="true"
          action="/api/upload"
          name="file"
          :headers="{
            Authorization: tokenStore.token,
          }"
          :on-success="uploadSuccess"
          class="avatar-uploader"
          :show-file-list="false"
        >
          <!-- <img v-if="imgUrl" :src="imgUrl" class="avatar" /> -->
          <img :src="avatar" width="278" />
        </el-upload>
        <br />
        <el-button
          type="primary"
          :icon="Plus"
          size="large"
          @click="uploadRef.$el.querySelector('input').click()"
        >
          选择图片
        </el-button>
        <el-button type="success" :icon="Upload" size="large" @click="updataAvatar">
          上传头像
        </el-button>
      </el-col>
    </el-row>
  </el-card>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }

    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>
