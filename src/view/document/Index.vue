<template>
     <!-- 面包屑 -->
    <Breadcrumb></Breadcrumb>
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
                                :key="item.index"
                                :label="item.name"
                                :value="item.value"
                            />
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="el-form">
                        <el-form-item label="文件类型">
                            <el-select v-model="searchForm.docType" placeholder="请选择">
                            <el-option
                                v-for="item in docTypeList"
                                :key="item.index"
                                :label="item.name"
                                :value="item.value"
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
            <el-button type="danger" :icon="Delete">批量删除</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%;margin-top:20px"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="number" label="文档编号" width="100" />
            <el-table-column prop="name" label="文档名称" width="260" />
            <el-table-column prop="scene" label="所属场景" width="300" />
            <el-table-column prop="type" label="文件类型" width="150" />
            <el-table-column prop="date" label="创建时间" width="200" />
            <el-table-column label="操作">
                <template #default="scope">
                    <el-link type="primary" @click="downloadDoc" :underline="false">下载</el-link>
                    <el-link type="primary" @click="editDoc" :underline="false">编辑</el-link>
                    <el-link type="danger" @click="deleteDoc" :underline="false">删除</el-link>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination style="margin-top:20px" :current-page="searchForm.current" :page-size="searchForm.size"
            :page-sizes="[10, 20, 30, 40]" layout="->,total, sizes, prev, pager, next, jumper" :total="total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-card>
    <!-- 新增编辑文档 -->
    <el-dialog v-model="dialogFormVisible" title="新增文档" width="500">
        <el-form ref="docRuleFormRef" :model="docRuleForm" :rules="docRules" label-width="auto">
            <el-form-item label="文档名称" :label-width="formLabelWidth" prop="name" v-if="isBulk!==true">
                <el-input v-model="docRuleForm.name" placeholder="请输入文档名称" />
            </el-form-item>
            <el-form-item label="文档编号" :label-width="formLabelWidth" prop="num" v-if="isBulk!==true">
                <el-input v-model="docRuleForm.num" placeholder="请输入文档编号" />
            </el-form-item>
            <el-form-item label="所属场景" :label-width="formLabelWidth" prop="scene">
                <el-select
                    v-model="docRuleForm.scene"
                    multiple
                    placeholder="请选择所属场景"
                    >
                    <el-option
                        v-for="item in uploadSceneList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                    />
                    </el-select>
            </el-form-item>
            <el-form-item label="文档上传" :label-width="formLabelWidth" required>
                <!-- 上传 -->
                <el-upload :limit="1" v-model:file-list="fileList" class="upload-demo"
                    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :on-change="handleChange">
                    <el-button type="primary">点击上传</el-button>

                    <template #tip>
                        <div class="el-upload__tip">
                            jpg/png files with a size less than 500kb
                        </div>
                    </template>
                </el-upload>
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

<script lang="ts" setup>
import userApi from "../../api/user";
import Breadcrumb from '../../components/Breadcrumb.vue';
import { onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, RefreshLeft, Plus, Delete} from '@element-plus/icons-vue';
import type { UploadProps, UploadUserFile, FormInstance, FormRules} from 'element-plus';
import { useRouter } from 'vue-router'
const router = useRouter();
// Dom 挂载之后
onMounted(() => {
    // getUserList();
})
// 所属场景
const sceneList = ref([
  {
    name: '全部',
    value: '全部',
  },{
    name: '物流',
    value: '物流',
  },{
    name: '营销',
    value: '营销',
  },{
    name: '采购',
    value: '采购',
  },{
    name: '综合行政',
    value: '综合行政',
  }])
// 文件类型
const docTypeList = ref([
  {
    name: '全部',
    value: '全部',
  },{
    name: 'pdf',
    value: 'pdf',
  },{
    name: 'word',
    value: 'word',
  },{
    name: 'pptx',
    value: 'pptx',
  },{
    name: 'excel',
    value: 'excel',
  }])

// 用户数据
let tableData = ref([
    {
        number: 1,
        name: '每日推荐视频集',
        scene:'未分配',
        type: 'pdf',
        date: '2021-05-03',
    },
    {
        number: 2,
        name: '每日推荐视频集',
        scene:'物流、营销',
        type: 'world',
        date: '2021-05-03',
    },
    {
        number: 2,
        name: '每日推荐视频集',
        scene:'物流、营销',
        type: 'world',
        date: '2021-05-03',
    },
    {
        number: 2,
        name: '每日推荐视频集',
        scene:'物流、营销',
        type: 'world',
        date: '2021-05-03',
    },
    {
        number: 2,
        name: '每日推荐视频集',
        scene:'物流、营销',
        type: 'world',
        date: '2021-05-03',
    },
    {
        number: 2,
        name: '每日推荐视频集',
        scene:'物流、营销',
        type: 'world',
        date: '2021-05-03',
    },
    {
        number: 2,
        name: '每日推荐视频集',
        scene:'物流、营销',
        type: 'world',
        date: '2021-05-03',
    },
    {
        number: 2,
        name: '每日推荐视频集',
        scene:'物流、营销',
        type: 'world',
        date: '2021-05-03',
    },
]);
let total = ref(0);
// 搜索条件
const searchForm = reactive({
    current: 1,
    size: 10,
    num:'',
    name:'',
    scene:'',
    docType:'',
    createTime:''
})
// 获取用户列表
const getUserList = async () => {
    const res = await userApi.getUserList(searchForm);
    console.log(res);
    tableData.value = res.data.data.records;
    total.value = res.data.data.total;
}

// 弹窗
// 上传所属场景
const uploadSceneList = [
  {
    name: '物流',
    value: '物流',
  },{
    name: '营销',
    value: '营销',
  },{
    name: '采购',
    value: '采购',
  },{
    name: '综合行政',
    value: '综合行政',
  }]

const formLabelWidth = '140px'
const dialogFormVisible = ref(false);
const fileList = ref<UploadUserFile[]>([
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
  {
    name: 'food2.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
])

const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  fileList.value = fileList.value.slice(-3)
}

// 上传校验规则
interface DocRuleForm {
  name: string
  num: string
  scene: Array
}

const docRuleFormRef = ref<FormInstance>()

const docRuleForm = reactive<DocRuleForm>({
  name: '',
  num: '',
  scene: []
})

const docRules = reactive<FormRules<DocRuleForm>>({
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


// 上传
// 是否批量
const isBulk = ref(false);
const uploadDoc = () => {
    isBulk.value = false
    dialogFormVisible.value = true
}
// 批量上传
const uploadBulkDoc = () =>{
    isBulk.value = true
    dialogFormVisible.value = true
}
// 保存
const saveDoc = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}
// 取消
const cancleDoc = () => {
    docRuleFormRef.value.resetFields()
    dialogFormVisible.value = false
}
// 编辑
const editDoc = () => {
    isBulk.value = false
    dialogFormVisible.value = true
}

const handleSelectionChange = (val) => {
    multipleSelection.value = val
}
const handleSizeChange = (val) => {
}
const handleCurrentChange = (val) => {

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