<template>
     <!-- 面包屑 -->
    <BreadcrumbDing></BreadcrumbDing>
    <el-card>
        <template #header>
            <div class="card-header" >
                <span>文档管理</span>
            </div>
        </template>
        <!-- 顶部搜索表单 -->
        <div id="topForm">
            <el-form id="searchForm" ref="searchFormRef" label-position="right" label-width="80px" :model="searchForm">
                <div class="search-data">
                    <div class="el-form">
                        <el-form-item label="文档编号">
                            <el-input v-model="searchForm.num" placeholder="请输入文档编号" />
                        </el-form-item>
                    </div>
                    <div class="el-form">
                        <el-form-item label="文档名称">
                            <el-input v-model="searchForm.name" placeholder="请输入文档名称" />
                        </el-form-item>
                    </div>
                    <div class="el-form">
                        <el-form-item label="所属场景">
                            <el-select v-model="searchForm.scene" placeholder="请选择">
                            <el-option
                                v-for="item in sceneList"
                                :key="item.conditionsId"
                                :label="item.conditionsName"
                                :value="item.conditionsId"
                            />
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="el-form">
                        <el-form-item label="文件类型">
                            <el-select v-model="searchForm.docType" placeholder="请选择">
                            <el-option
                                v-for="item in docTypeList"
                                :label="item"
                                :value="item"
                            />
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="el-form">
                        <el-form-item label="创建时间">
                            <el-date-picker
                                v-model="searchForm.createTime"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="YYYY-MM-DD"
                                :size="size"
                            />
                        </el-form-item>
                    </div>
                </div>
                    <!-- 添加一个包装容器 -->
                <div class="flex-container">
                    <el-button type="primary" :icon="Search" style="flex-shrink: 0; flex: none;" @click="search">搜索</el-button>
                    <el-button type="info" :icon="RefreshLeft" style="flex-shrink: 0; flex: none;" @click="resetSearch">重置</el-button>
                </div>
            </el-form>
        </div>
        <!-- 按钮 -->
        <div class="btn-wrap">
            <el-button type="primary" :icon="Plus" @click="uploadDoc">上传</el-button>
            <el-button type="primary" @click="uploadBulkDoc" :icon="Plus">批量上传</el-button>
            <el-button type="danger" @click="multiDeleteDoc" >批量删除</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%;margin-top:20px"
            @selection-change="handleSelectionChange" v-loading="loading">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="fileId" label="文档编号" width="300" />
            <el-table-column prop="name" label="文档名称" width="260" />
            <el-table-column prop="conditions" label="所属场景" width="100" />
            <el-table-column prop="remark" label="文件类型" width="150" />
            <el-table-column prop="createTime" label="创建时间" width="200" >
            <template #default="scope">
                    {{ proxy.$commonJs.formattedTime(scope.row.createTime) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template #default="scope">
                    <el-link type="primary" @click="editDoc(scope.row)" :underline="false">编辑</el-link>
                    <el-link type="danger" @click="deleteDoc(scope.row.id)" :underline="false">删除</el-link>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination style="margin-top:20px" :current-page="pageNo" :page-size="pageSize"
            :page-sizes="[10, 20, 30, 40]" layout="->,total, sizes, prev, pager, next, jumper" :total="total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-card>
    <!-- 新增编辑文档 -->
    <el-dialog v-model="dialogFormVisible" :title="docTitle" width="500" @close="cancleDoc">
        <el-form ref="docRuleFormRef" :model="docRuleForm" :rules="docRules" label-width="auto">
            <el-form-item label="文档名称" :label-width="formLabelWidth" prop="name" v-if="isBulk!==true">
                <el-input v-model="docRuleForm.name" placeholder="请输入文档名称" />
            </el-form-item>
            <el-form-item label="所属场景" :label-width="formLabelWidth" prop="scene">
                <el-select
                    v-model="docRuleForm.scene"
                    multiple
                    placeholder="请选择所属场景"
                    >
                    <el-option
                        v-for="item in sceneList"
                        :key="item.conditionsId"
                        :label="item.conditionsName"
                        :value="item.conditionsId"
                    />
                    </el-select>
            </el-form-item>
            <el-form-item label="文档上传" :label-width="formLabelWidth" required>
                <!-- 上传 -->
                <UploadFile :fileUrlList="fileUrls"   @updateFileValue="getfilesData" :isUpload="canUpload"></UploadFile>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="saveDoc(docRuleFormRef)">
                    保存
                </el-button>
                <el-button @click="cancleDoc">关闭</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script  setup>
import documentApi from "../../api/document";
import sceneApi from "../../api/scene";
import { onMounted, reactive, ref,getCurrentInstance,toRef } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, RefreshLeft, Plus, Delete} from '@element-plus/icons-vue';


import BreadcrumbDing from '../../components/BreadcrumbDing.vue';
import UploadFile from "../../components/UploadFile.vue";

const { proxy } = getCurrentInstance();

let docTitle = ref('上传文档')
let fileParams = ref([]) // 文档传参
let fileUrls = ref([])
let pageNo = ref(1)
let pageSize = ref(10);
let total = ref(10);
let loading = ref(true)
const isBulk = ref(false);
const canUpload = ref(true)
const multipleSelection = ref([])
// 所属场景
const sceneList = ref([])
// 文件类型
const docTypeList = ref([
  ])

// 用户数据
let tableData = ref([]);

// 搜索条件
const searchForm = reactive({
    num:'',
    name:'',
    scene:'',
    docType:'',
    createTime: []
})
const search = ()=> {
    pageNo.value = 1
    getDocumentList()
}

const resetSearch = ()=> {
    pageNo.value = 1
    searchForm.num = ''
    searchForm.name = ''
    searchForm.scene = ''
    searchForm.docType = ''
    searchForm.createTime = []
    getDocumentList()
}
// 获取文档列表     文档编号 fileId  文档名称 name  文件类型 remark 创建时间 createTime【startTime,endTime】
const getDocumentList = async () => {
    let startTime = proxy.$commonJs.formateTimestamp(searchForm.createTime[0]);
    let endTime = proxy.$commonJs.formateTimestamp(searchForm.createTime[1]);
    let param = {
    pageNo: pageNo.value,
    pageSize: pageSize.value,
    conditionsId: searchForm.scene,
    name: searchForm.name,
    fileId : searchForm.num,
    remark: searchForm.docType,
    createTime: [startTime,endTime]
  }
  const res = await documentApi.getDocumentList(param);
  if (res.data) {
    loading.value = false;
    total.value = res.data.total;
    tableData.value = res.data.list;
  }
}
// 获取场景列表
const getSceneList = async () => {
  let param = {
    conditionsName: ''
  }
  const res = await sceneApi.getSceneList(param);
  if (res.data) {
    loading.value = false;
    sceneList.value = res.data.sort((a, b) => a.conditionsSort - b.conditionsSort);
  }
};
// 获取文件类型列表
const getTypeList = async () => {
  const res = await documentApi.getDocumentTypeList();
  if (res.data) {
    docTypeList.value = res.data;
  }
};
const getfilesData = (item) => {
    if(item.value.length > 0){
        item.value.map(v => {
            fileParams.value.push({
                name: v.name,
                fileUrl: v.url,
                remark: v.type
            })
        })
    }
}
// 弹窗
// 上传所属场景
const formLabelWidth = '140px'
const dialogFormVisible = ref(false);

const docRuleFormRef = ref()
const docRuleForm = reactive({
  name: '',
  scene: []
})

const docRules = reactive({
    name: [
        { required: true, message: '请输入文档名称', trigger: 'blur' },
        { min: 3, max: 10, message: '长度 3 到 10', trigger: 'blur' },
    ],
    num: [
        { required: true, message: '请输入文档编号', trigger: 'blur' },
        { min: 3, max: 10, message: '长度 3 到 10', trigger: 'blur' },
    ],
    scene:  [{
      required: true,
      message: '请选择所属场景',
      trigger: 'change',
    }]
})

// 重置文件上传表单
const resetFile = () => {
    // childComp.value.clear();

    docRuleFormRef.value.resetFields();
    fileUrls.value = [];
    proxy.$commonJs.clearObj(docRuleForm)
}
// 上传

const uploadDoc = () => {
    docTitle.value = '上传文档';
    isBulk.value = false
    canUpload.value = true;
    dialogFormVisible.value = true
}
// 批量上传
const uploadBulkDoc = () =>{
    docTitle.value = '批量上传文档';
    isBulk.value = true
    canUpload.value = true;
    dialogFormVisible.value = true
}
// 取消
const cancleDoc = () => {
    resetFile()
    dialogFormVisible.value = false
}
// 编辑
const editDoc = (item) => {
    docTitle.value = '编辑文档';
    docRuleForm.name = item.name;
    canUpload.value = false;
    docRuleForm.scene = item.conditionsList;
    fileUrls.value.push({ name: item.name, url: item.fileUrl})
    isBulk.value = false
    dialogFormVisible.value = true
}
// 保存
const saveDoc = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
        if(docTitle.value !== '编辑文档'){
        addDoc()
        } else{
        editDocs()
        }
        dialogFormVisible.value = false;
    } else {
      console.log('error submit!', fields)
    }
  })
}
// 文档上传api
const addDoc = async () => {
    // let conditionsList = [];
    let params = {}
    // conditionsList.push(docRuleForm.scene)
    let fileVal = JSON.parse(JSON.stringify((fileParams.value)))
    if(docTitle.value === '上传文档'){
        params = {
        conditionsList: docRuleForm.scene,
        name: fileVal[0].name,
        fileUrl: fileVal[0].fileUrl,
        remark: fileVal[0].type
       }
    } else{
        params = {
        conditionsList: docRuleForm.scene,
        fileList: fileParams.value,
       }
    }

    const res =  docTitle.value === '上传文档' ? await documentApi.addDocument(params) : await documentApi.addMulDocument(params);
        if (res.data) {
            ElMessage.success("上传成功")
            getDocumentList();
        } else {
            ElMessage.error("上传失败")
        }
};
// 文档编辑api
const editDocs = async () => {
    // let conditionsList = [];
    // conditionsList.push(docRuleForm.scene)
    const param = {
        conditionsList: docRuleForm.scene,
        name: docRuleForm.name
    }
    const res = await documentApi.editDocument(param);
        if (res.data) {
            ElMessage.success("编辑成功")
            getDocumentList();
        } else {
            ElMessage.error("编辑失败")
        }
};


const handleSelectionChange = (val) => {
    multipleSelection.value = val
}
const handleSizeChange = (val) => {
    pageSize.value = val;
    loading.value = true;
    getDocumentList();
}
const handleCurrentChange = (val) => {
    pageNo.value = val;
    loading.value = true;
    getDocumentList();
}



// 删除文档
const deleteDoc = (id) => {
    ElMessageBox.confirm(
        '您即将删除该文档，请确认后操作。',
        '删除文档',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        const res = await documentApi.deleteDocument({ id: id });
        if (res.data) {
            ElMessage.success("删除成功")
            getDocumentList();
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
// 批量删除文档
const multiDeleteDoc = () => {
    if (multipleSelection.value.length === 0) {
        ElMessage.warning('请选择要删除的文档')
        return
    }
    let id = multipleSelection.value.map((item) => item.id).join(',');
    ElMessageBox.confirm(
        '您即将删除该场景，所属场景下的文档将同步被取消分类，进入"未分配"状态，请确认后操作。',
        '删除文档',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        const res = await documentApi.deleteMulDocument({ ids: id });
        if (res.data) {
            ElMessage.success("删除成功")
            getDocumentList();
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
// Dom 挂载之后
onMounted(() => {
    getSceneList();
    getTypeList();
    getDocumentList();
})
</script>

<style lang="scss" scoped>
:deep(.el-card__header) {
    border: none !important;
}
#searchForm{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.search-data{
    width: calc(100% - 120px);
    display: flex;
    flex-wrap: wrap;
    .el-form{
        width:33.3333%;
    }
}
.flex-container{
    width: 100px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    .el-button{
        margin-bottom: 18px;
    }
    .el-button+.el-button {
        margin-left: 0;
    }
}

.btn-wrap{
    width: 100%;
}
.cell {
    .el-link {
        margin-right: 10px;
    }
}
</style>