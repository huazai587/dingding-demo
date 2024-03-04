<template>
 <!-- 面包屑 -->
  <Breadcrumb></Breadcrumb>
  <el-card v-show="route.meta.showFather">
    <template #header>
      <div class="card-header">
        <span>场景列表</span>
      </div>
    </template>
    <div style="margin-bottom: 20px;">
      <el-input style="width:300px; margin-right: 20px;" :suffix-icon="Search" @change="searchScene"
        v-model="searchForm.name" placeholder="请输入场景名称">
      </el-input>
      <el-button type="primary" @click="addScene" icon="Plus">新增场景</el-button>
    </div>
    <div class="box-card">
      <el-card v-for="item in sceneList" :body-style="{ paddingTop: '0px' }">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <img src="../../assets/img/avator.png" alt="" srcset="" width="16" height="16">
              <span >{{ '物流' }}</span>
              <!-- <el-tag type="success">
                <el-icon><CircleCheck /></el-icon>
                已开启
              </el-tag> -->
              <el-tag type="info">
                <el-icon><VideoPause /></el-icon>
                已停用
              </el-tag>
            </span>
            <el-icon style="cursor: pointer;">
              <Delete  @click="deleteScene"/>
            </el-icon>
          </div>
        </template>
        <div class="card-item">
          <p>创建时间：{{ "2024.02.23 12:22:22" }}</p>
          <p>文档数量：{{ "100.00" }}</p>
          <p>文档空间：{{ "12GB" }}</p>
        </div>

        <template #footer>
          <div style="float: right;height: 32px;">
            <el-button class="button" type="primary" @click="addScene">编辑场景</el-button>
            <el-button class="button" type="info" @click="goDoc">文档管理</el-button>
          </div>
        </template>
      </el-card>
    </div>
  </el-card>

  <router-view ></router-view>
  <el-dialog v-model="dialogFormVisible" title="新增场景" width="500">
    <el-form :model="sceneform" :rules="rules" label-width="auto">
      <el-form-item label="场景名称" :label-width="formLabelWidth" required>
        <el-input v-model="sceneform.name" autocomplete="off" placeholder="请输入场景名称" />
      </el-form-item>
      <el-form-item label="场景排序" :label-width="formLabelWidth" required>
        <el-input v-model="sceneform.sort" autocomplete="off" placeholder="请输入场景序号" />
      </el-form-item>
      <el-form-item label="场景图标上传" :label-width="formLabelWidth" required>
        <UploadIcon></UploadIcon>
      </el-form-item>
      <el-form-item label="场景启用" :label-width="formLabelWidth">
        <el-switch v-model="sceneform.status" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="saveScene">
          保存
        </el-button>
        <el-button @click="cancleScene">关闭</el-button>
      </div>
    </template>
  </el-dialog>
  
</template>

<script lang="ts" setup>
import userApi from "../../api/user";
import { onMounted, reactive, ref } from "vue";
import UploadIcon from "../../components/UploadIcon.vue";
import Breadcrumb from '../../components/Breadcrumb.vue';
import type { FormInstance, FormRules } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus';

import { useRouter, useRoute } from 'vue-router'
const router = useRouter();
const route = useRoute();
const formLabelWidth = '140px'
const dialogFormVisible = ref(false);
interface RuleForm {
  name: string
  region: string
  status: boolean
}
const sceneform = reactive({
  name: '',
  sort: '',
  status: true
})
const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
  ]
})
const goDoc = () => {
  router.push('/scene/document-list/1')
}
// Dom 挂载之后
onMounted(() => {
  // getUserList();
})
// 用户数据
let sceneList = ref([1, 2, 3, 4]);
let total = ref(0);
// 搜索条件
const searchForm = reactive({
  current: 1,
  size: 10,
  name: ''
})
const deleteScene = ()=>{
  ElMessageBox.confirm(
        '您即将删除该场景，所属场景下的文档将同步被取消分类，进入"未分配"状态，请确认后操作。',
        '确认删除场景',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        const res = await userApi.delUser({ id: id });
        if (res.data.success) {
            ElMessage.success("删除成功")
            getUserList();
        } else {
            ElMessage.error("删除失败")
        }
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '取消删除',
        })
    })
}
// 获取用户列表
const getUserList = async () => {
  const res = await userApi.getUserList(searchForm);
  console.log(res);
  tableData.value = res.data.data.records;
  total.value = res.data.data.total;
}

const addScene = () => {
  dialogFormVisible.value = true
}
const saveScene = () => {
  dialogFormVisible.value = false
}
const cancleScene = () => {
  dialogFormVisible.value = false
}
const searchScene = () => {
  searchForm.current = 1;
  getUserList();
}

</script>

<style lang="scss" scoped>
:deep(.el-card__header) {
  border: none !important;
}

:deep(.el-card__footer) {
  border: none !important;
  padding-top: 0;
  overflow: hidden;
}

.box-card {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  :deep(.el-card__header) {
    padding-bottom: 0px;
    overflow: hidden;
  }
  flex-grow: 1;
  flex-basis: 0;
  .el-card{
    width: 24%;
  }
  &:last-child {
    margin-right: 0;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-title {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 10px;
      span{
        font-size: 14px;
      }
      .el-tag{
        font-size: 12px;
        .el-icon{
          vertical-align: -1px;
        }
      }
    }
  }

  .card-item {
    font-size: 12px;
    color: #86909C;
  }
}
</style>