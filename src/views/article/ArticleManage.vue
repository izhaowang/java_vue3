<script setup>
import { Edit, Delete, Plus } from "@element-plus/icons-vue";
import articlesApi from "@/api/article.js";
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
const { getArticleCategory, getArticle, addArticle } = articlesApi;
//文章分类数据模型
const categorys = ref([]);

//用户搜索时选中的分类id
const categoryId = ref("");

//用户搜索时选中的发布状态
const state = ref("");

//文章列表数据模型
const articles = ref([]);

//分页条数据模型
const pageNum = ref(1); //当前页
const total = ref(20); //总条数
const pageSize = ref(3); //每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size;
  getArticleList();
};
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num;
  getArticleList();
};
const getArticleCatagoryList = async () => {
  let res = await getArticleCategory();
  categorys.value = res.data;
};
getArticleCatagoryList(); // 分类查询
const getArticleList = async () => {
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    categoryId: categoryId.value ? categoryId.value : null,
    state: state.value ? state.value : null,
  };
  let res = await getArticle(params);
  articles.value = res.data.items;
  total.value = res.data.total;

  for (var i = 0; i < articles.value.length - 1; i++) {
    for (var j = 0; j < categorys.value.length - 1; j++) {
      if (articles.value[i].categoryId === categorys.value[j].id) {
        articles.value[i].categoryName = categorys.value[j].categoryName;
      }
    }
  }
  console.log(articles.value);
};
getArticleList();

//控制抽屉是否显示
const visibleDrawer = ref(false);
//添加表单数据模型
const articleModel = ref({
  title: "",
  categoryId: "",
  coverImg: "",
  content: "",
  state: "",
});
const rules = {
  coverImg: [
    {
      required: false,
    },
  ],
};
import { useTokenStore } from "@/stores/token";
const tokenStore = useTokenStore();
const addArticleServer = async (state) => {
  articleModel.value.state = state;
  let res = await addArticle(articleModel.value);
  visibleDrawer.value = false;
  getArticleList();
};
const successUpload = (res) => {
  if (res && res.code === 0) {
    articleModel.coverImg = res.data;
    ElMessage.success(res.message ? res.message : "添加成功");
  }
};
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章管理</span>
        <div class="extra">
          <el-button type="primary" @click="visibleDrawer = true">添加文章</el-button>
        </div>
      </div>
    </template>
    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item label="文章分类：">
        <el-select placeholder="请选择" v-model="categoryId">
          <el-option
            v-for="c in categorys"
            :key="c.id"
            :label="c.categoryName"
            :value="c.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="发布状态：">
        <el-select placeholder="请选择" v-model="state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getArticleList">搜索</el-button>
        <el-button
          @click="
            categoryId = '';
            state = '';
          "
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 文章列表 -->
    <el-table :data="articles" style="width: 100%">
      <el-table-column label="文章标题" width="400" prop="title"></el-table-column>
      <el-table-column label="分类" prop="categoryName"></el-table-column>
      <el-table-column label="发表时间" prop="createTime"> </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary"></el-button>
          <el-button :icon="Delete" circle plain type="danger"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <!-- 分页条 -->
    <el-pagination
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :page-sizes="[3, 5, 10, 15]"
      layout="jumper, total, sizes, prev, pager, next"
      background
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />
    <!-- 抽屉 -->
    <el-drawer v-model="visibleDrawer" title="添加文章" direction="rtl" size="50%">
      <!-- 添加文章表单 -->
      <el-form :model="articleModel" label-width="100px" :rules="rules">
        <el-form-item label="文章标题">
          <el-input v-model="articleModel.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类">
          <el-select placeholder="请选择" v-model="articleModel.categoryId">
            <el-option
              v-for="c in categorys"
              :key="c.id"
              :label="c.categoryName"
              :value="c.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章封面">
          <!-- 
            auto-upload 是否自动上传
            action: 设置服务器接口路径
            name 上传文件名
            headers 请求头
            on-success 设置上传成功回调


         -->
          <el-upload
            class="avatar-uploader"
            :auto-upload="true"
            action="/api/upload"
            name="file"
            :headers="{
              Authorization: tokenStore.token,
            }"
            :on-success="successUpload"
            :show-file-list="false"
          >
            <img
              v-if="articleModel.coverImg"
              :src="articleModel.coverImg"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="文章内容">
          <div class="editor">
            <quill-editor
              theme="snow"
              v-model:content="articleModel.content"
              contentType="html"
            >
            </quill-editor>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addArticleServer('已发布')">发布</el-button>
          <el-button type="info" @click="addArticleServer('草稿')">草稿</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </el-card>
</template>
<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
/* 抽屉样式 */
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
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
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
