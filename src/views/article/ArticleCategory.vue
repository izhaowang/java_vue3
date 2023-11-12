<script setup lang="ts">
import articleApi from "@/api/article";
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
const {
  getArticleCategory,
  submitArticleCategory,
  editArticleCategory,
  deleatAtricile,
} = articleApi;
interface Category {
  categoryName: string;
  categoryAlias: string;
}
const tableData: [] = ref([]);
const getArticleCatagoryList = async () => {
  let res = await getArticleCategory();
  console.log(res);
  tableData.value = res.data;
};
getArticleCatagoryList();
const title = ref("");

const dialogVisible = ref(false);
//添加分类数据模型
const categoryModel = ref({
  categoryName: "",
  categoryAlias: "",
});
//添加分类表单校验
const rules = {
  categoryName: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
  categoryAlias: [{ required: true, message: "请输入分类别名", trigger: "blur" }],
};
const addArticleCategory = async () => {
  let res = await submitArticleCategory(categoryModel.value);
  ElMessage.success(res.message ? res.message : "添加成功");
  //隐藏弹窗
  dialogVisible.value = false;
  //再次访问后台接口，查询所有分类
  getArticleList();
};
const handleEdit = async (index: number, row: Category) => {
  dialogVisible.value = true;
  title.value = "编辑分类";
  console.log(index, row);
  categoryModel.value.categoryName = row.categoryName;
  categoryModel.value.categoryAlias = row.categoryAlias;
  categoryModel.value.id = row.id;
};

const handleDelete = (index: number, row: Category) => {
  console.log(index, row);
};
const setEditArticleCategory = async () => {
  let res = await editArticleCategory(categoryModel.value);
  ElMessage.success(res.message ? res.message : "添加成功");
  //隐藏弹窗
  dialogVisible.value = false;
  //再次访问后台接口，查询所有分类
  getArticleList();
};
// 添加分类要清空catagoryModel数据
const clearCategoryData = () => {
  categoryModel.value.categoryName = "";
  categoryModel.value.categoryAlias = "";
};
const setDeleatAtricile = (index, row) => {
  console.log(index, row);

  ElMessageBox.confirm("确认要删除嘛?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      // confirm
      // 调用删除分类接口
      let res = await deleatAtricile(row.id);
      ElMessage({
        type: "success",
        message: "删除成功",
      });
      getArticleList();
    })
    .catch(() => {
      ElMessage({
        // 取消
        type: "info",
        message: "取消了",
      });
    });
};
</script>
<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>文章分类</span>
        <el-button
          class="button"
          type="primary"
          @click="
            dialogVisible = true;
            title = '添加分类';
            clearCategoryData();
          "
          >添加分类</el-button
        >
      </div>
    </template>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" width="50" />
      <el-table-column label="分类名称">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.categoryName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="分类别名">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.categoryAlias }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
            >Edit</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click="setDeleatAtricile(scope.$index, scope.row)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
  </el-card>
  <!-- 添加分类弹窗 -->
  <el-dialog v-model="dialogVisible" :title="title" width="30%">
    <el-form
      :model="categoryModel"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item label="分类名称" prop="categoryName">
        <el-input
          v-model="categoryModel.categoryName"
          minlength="1"
          maxlength="10"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="categoryAlias">
        <el-input
          v-model="categoryModel.categoryAlias"
          minlength="1"
          maxlength="15"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="title === '添加分类' ? addArticleCategory() : setEditArticleCategory()"
        >
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}
</style>
