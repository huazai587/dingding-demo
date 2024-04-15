<template>
 <!-- 面包屑 -->
  <BreadcrumbDing></BreadcrumbDing>
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
      <el-button type="primary" @click="addScene(false)" icon="Plus">新增场景</el-button>
    </div>
    <div class="box-card">
      <el-card v-for="item in sceneList" :body-style="{ paddingTop: '0px' }" v-loading="loading">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <img :src="item.conditionsIcon" alt="" srcset="" width="16" height="16">
              <!-- <img src="../../assets/img/avator.png" alt="" srcset="" width="16" height="16"> -->
              <span >{{ item.conditionsName }}</span>
              <el-tag type="success" v-if="item.state === '0'">
                <el-icon><CircleCheck /></el-icon>
                已开启
              </el-tag>
              <el-tag type="info" v-if="item.state === '1' ">
                <el-icon><VideoPause /></el-icon>
                已停用
              </el-tag>
            </span>
            <el-icon style="cursor: pointer;" v-if="item.conditionsName !== '通用'">
              <Delete  @click="deleteScene(item.conditionsId)"/>
            </el-icon>
          </div>
        </template>
        <div class="card-item">
          <p>创建时间：{{ proxy.$commonJs.formattedTime(item.createTime) }}</p>
          <p>文档数量：{{ item.num || '--' }}</p>
        </div>

        <template #footer>
          <div style="float: right;height: 32px;">
            <el-button class="button" type="primary" @click="addScene(item)">编辑场景</el-button>
            <el-button class="button" type="info" @click="goDoc(item)">文档管理</el-button>
          </div>
        </template>
      </el-card>
    </div>
  </el-card>
  <router-view ></router-view>

  <el-dialog v-model="dialogFormVisible" :title="scenePopTitle" width="500" @close="cancleScene">
    <el-form  ref="ruleFormRef"  :model="sceneform" :rules="sceneformRules" label-width="120px">
      <el-form-item label="场景名称"  prop="name" required>
        <el-input v-model="sceneform.name" autocomplete="off" placeholder="请输入场景名称" />
      </el-form-item>
      <el-form-item label="场景排序"  prop="sort" required>
        <el-input v-model="sceneform.sort" autocomplete="off" placeholder="请输入场景序号" />
      </el-form-item>
      <el-form-item label="场景图标上传"  required>
        <UploadIcon  :fileUrl="sceneform.conditionsIcon" @updateFileValue="getfilesData" ></UploadIcon>
      </el-form-item>
      <el-form-item label="场景启用" >
        <el-switch v-model="sceneform.state" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="saveScene()">
          保存
        </el-button>
        <el-button @click="cancleScene">关闭</el-button>
      </div>
    </template>
  </el-dialog>
  
</template>

<script  setup>
import sceneApi from "../../api/scene";
import { onMounted, reactive, ref, getCurrentInstance } from "vue";
import UploadIcon from "../../components/Upload.vue";
import BreadcrumbDing from '../../components/BreadcrumbDing.vue';
 import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus';
const { proxy } = getCurrentInstance();
import { useRouter, useRoute } from 'vue-router'
const router = useRouter();
const route = useRoute();
const dialogFormVisible = ref(false);
const loading = ref(true)
const ruleFormRef = ref();
let editSceneId = ref('');
let scenePopTitle = ref('新增场景');
const sceneform = reactive({
  name: "",
  sort: "",
  conditionsIcon: "",
  state: true
})
const sceneformRules = reactive({
  name: [
    { required: true, message: '请输入场景名称', trigger: 'blur' },
  ],
  sort: [
    { required: true, message: '请输入场景序号', trigger: 'blur' },
  ]
})
// 跳转文档管理
const goDoc = (data) => {
  sessionStorage.setItem("activePath", '/scene');
  router.push(`/scene/document-list/${data.conditionsId}`)
}
// Dom 挂载之后
onMounted(() => {
  getSceneList();
})
// 用户数据
let sceneList = ref([]);
// 搜索条件
const searchForm = reactive({
  name: ''
})


const deleteScene = (id)=>{
  ElMessageBox.confirm(
        '您即将删除该场景，所属场景下的文档将同步被取消分类，进入"未分配"状态，请确认后操作。',
        '确认删除场景',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        const res = await sceneApi.deleteScene({ conditionsId: id });
        if (res.data) {
            ElMessage.success("删除成功")
            getSceneList();
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
// 获取场景管理列表
const getSceneList = async () => {
  let param = {
    conditionsName: searchForm.name
  }
  const res = await sceneApi.getSceneList(param);
  if (res.data) {
    loading.value = false;
    sceneList.value = res.data.sort((a, b) => a.conditionsSort - b.conditionsSort);
  }
};

// 取上传子组件的参数
const getfilesData = (fileVal) => {
  let filedata = JSON.parse(JSON.stringify(fileVal.value))
   sceneform.conditionsIcon = filedata[0].url; // 图片地址
}
const addScene = (val) => {
  sceneform.conditionsIcon = ''
  if(val){ // 编辑场景
    scenePopTitle.value =  '编辑场景';
    editSceneId.value = val.conditionsId || '';
    sceneform.name = val.conditionsName;
    sceneform.sort = val.conditionsSort;
    sceneform.conditionsIcon = val.conditionsIcon;
    sceneform.state = val.state === '0' ? true : false;
  } else {
    scenePopTitle.value =  '新增场景';
  }
  dialogFormVisible.value = true;

}
// 保存场景
const saveScene = () => {
  if (!ruleFormRef) return;
  ruleFormRef.value.validate( (valid) => {
    if (valid) {
       let param = {
          conditionsName: sceneform.name,
          conditionsSort: sceneform.sort,
          conditionsIcon: sceneform.conditionsIcon,
          state: sceneform.state ? '0' : '1',
        }
        if(scenePopTitle.value === '编辑场景'){
          param['conditionsId'] = editSceneId.value 
          sceneApi.editScene(param).then(res=>{
            if(res.data){
              ElMessage.success('编辑成功')
              dialogFormVisible.value = false;
              getSceneList();
            }else{
              ElMessage.error('编辑失败')
            }
          })
        }else{
          sceneApi.addScene(param).then(res=>{
            if(res.data){
              ElMessage.success('新增成功');
              dialogFormVisible.value = false;
              getSceneList();
            }
          })
        }
    } else{
      return false;
    }
 })
}
const cancleScene = () => {
  ruleFormRef.value.resetFields();
  dialogFormVisible.value = false
}
const searchScene = () => {
  getSceneList();
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
:deep(.el-card__body){
  overflow: hidden;
}

.box-card {
  :deep(.el-card__header) {
    padding-bottom: 0px;
    overflow: hidden;
  }

  .el-card{
    float: left;
    width: 310px;
    margin-right: 15px;
    margin-top: 15px;
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