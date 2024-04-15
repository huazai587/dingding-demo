<template>
    <el-card>
        <template #header>
            <div class="card-header">
                <span>文档列表</span>
            </div>
        </template>
        <div class="btn-wrap">
            <el-input style="width:300px; margin-right: 20px;" :suffix-icon="Search" @change="searchDoc"
                v-model="docName" placeholder="请输入文档名称">
            </el-input>
            <el-button type="primary" :icon="Plus" @click="uploadDoc">上传</el-button>
            <el-button type="primary" :icon="Plus" @click="multiuploadDoc">批量上传</el-button>
            <el-button type="danger" :icon="Delete" @click="multiDeleteDoc" v-if="!isGeneral">批量删除</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%;margin-top:20px" @selection-change="handleSelectionChange"
            v-loading="loading">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="fileId" label="文档编号" width="180" />
            <el-table-column prop="name" label="文档名称" />
            <el-table-column prop="remark" label="文件类型" width="180">
                <template #default="scope">
                    {{ scope.row.remark || '--' }}
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180">
                <template #default="scope">
                    {{ proxy.$commonJs.formattedTime(scope.row.createTime) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template #default="scope">
                    <el-link type="primary" @click="editDoc(scope.row);" :underline="false">编辑</el-link>
                    <el-link type="danger" @click="deleteDoc(scope.row.id)" :underline="false"
                        v-if="!isGeneral">删除</el-link>
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
        <el-form ref="ruleFormRef" :model="documentForm" :rules="!isMultiple ? rules : {}" label-width="80px">
            <el-form-item label="文档名称" prop="name" required v-if="!isMultiple">
                <el-input v-model="documentForm.name" autocomplete="off" placeholder="请输入文档名称" />
            </el-form-item>
            <el-form-item label="文档上传" required>
                <!-- 上传 -->
                <UploadFile :fileUrlList="fileUrls" ref="childComp" @updateFileValue="getfilesData"
                    :isUpload="canUpload">
                </UploadFile>
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="saveDoc">
                    保存
                </el-button>
                <el-button @click="cancleDoc">关闭</el-button>
            </div>
        </template>
    </el-dialog>

</template>

<script setup>
import { onMounted, reactive, ref, getCurrentInstance } from "vue";
import { Search, Plus, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import UploadFile from "../../components/UploadFile.vue";
import documentApi from "../../api/document";
import { useRoute } from 'vue-router';


const { proxy } = getCurrentInstance();
const dialogFormVisible = ref(false);
const ruleFormRef = ref();
const isMultiple = ref(false);
const canUpload = ref(true)
const route = useRoute();

const childComp = ref(null);

let fileUrls = ref([])
let docTitle = ref('上传文档')
let fileParams = ref([]) // 文档传参
let isGeneral = ref(false)
let tableData = ref([])
let docName = ref('')
let docId = ref('')
let pageNo = ref(1)
let pageSize = ref(10);
let total = ref(10)
let conditionsId = ref(0)
let loading = ref(true)
const multipleSelection = ref([])

const documentForm = reactive(
    !isMultiple ?
        {
            name: '',
            fileUrl: ''
        } : { fileUrl: '' }
)
const rules = reactive({
    name: [
        { required: true, message: '请输入文档名称', trigger: 'blur' },
    ]
})
// 重置文件上传表单
const resetFile = () => {
    // childComp.value.clear();
    // ruleFormRef.value.resetFields();
    fileParams.value = [];
    fileUrls.value = [];
    proxy.$commonJs.clearObj(documentForm)
}
// 单个文档上传
const uploadDoc = () => {
    docTitle.value = '上传文档';
    isMultiple.value = false;
    canUpload.value = true;
    dialogFormVisible.value = true;
    resetFile()
}
// 批量上传
const multiuploadDoc = () => {
    docTitle.value = '批量上传文档';
    isMultiple.value = true;
    canUpload.value = true;
    dialogFormVisible.value = true;
    resetFile()
}
// 编辑文档
const editDoc = (val) => {
    isMultiple.value = false;
    docTitle.value = '编辑文档'
    docId.value = val.id;
    canUpload.value = false;
    documentForm.name = val.name;
    fileUrls.value.push({ name: val.name, url: val.fileUrl })
    dialogFormVisible.value = true
}
const getfilesData = (item) => {
    if (item.value.length > 0) {
        item.value.map(v => {
            fileParams.value.push({
                name: v.name,
                fileUrl: v.url,
                remark: v.type
            })
        })
        if (item.value.length === 1) {
            documentForm.name = item.value[0].name
        }
    }
}
const saveDoc = () => {
    if (!ruleFormRef) return;
    ruleFormRef.value.validate((valid) => {
        if (valid) {
            if (docTitle.value !== '编辑文档') {
                addDoc()
            } else {
                editDocs()
            }
            dialogFormVisible.value = false;
        } else {
            return false;
        }
        isMultiple.value = false
    })
}
const cancleDoc = () => {
    resetFile()
    dialogFormVisible.value = false
}


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
        '您即将删除该场景，所属场景下的文档将同步被取消分类，进入"未分配"状态，请确认后操作。',
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
// 文档上传api
const addDoc = async () => {
    let conditionsList = [];
    let params = {}
    conditionsList.push(conditionsId.value)
    let fileVal = JSON.parse(JSON.stringify((fileParams.value)))
    if (docTitle.value === '上传文档') {
        params = {
            conditionsList: conditionsList,
            name: fileVal[0].name,
            fileUrl: fileVal[0].fileUrl,
            remark: fileVal[0].remark
        }
    } else {
        params = {
            conditionsList: conditionsList,
            fileList: fileVal,
        }
    }

    const res = docTitle.value === '上传文档' ? await documentApi.addDocument(params) : await documentApi.addMulDocument(params);
    if (res.data) {
        ElMessage.success("上传成功")
        getDocumentList();
    } else {
        ElMessage.error("上传失败")
    }
};
// 文档编辑api
const editDocs = async () => {
    let conditionsList = [];
    conditionsList.push(conditionsId.value)
    const param = {
        id: docId.value,
        conditionsList: conditionsList,
        name: documentForm.name
    }
    const res = await documentApi.editDocument(param);
    if (res.data) {
        ElMessage.success("编辑成功")
        getDocumentList();
    } else {
        ElMessage.error("编辑失败")
    }
};
// 获取文档管理列表
const getDocumentList = async () => {
    let param = {
        pageNo: pageNo.value,
        pageSize: pageSize.value,
        conditionsId: Number(conditionsId.value),
        name: docName.value
    }
    const res = await documentApi.getDocumentList(param);
    if (res.data) {
        loading.value = false;
        total.value = res.data.total;
        tableData.value = res.data.list;
    }
};
const searchDoc = () => {
    pageNo.value = 1;
    loading.value = true;
    getDocumentList();
}
// Dom 挂载之后
onMounted(() => {
    conditionsId.value = route.params.id;
    isGeneral.value = route.params.id === '5';
    getDocumentList();
})
</script>

<style lang="scss" scoped>
.el-link,
.link {
    margin-right: 10px;
}

.link {
    text-decoration: none;
    vertical-align: bottom;
    color: var(--el-color-primary);

    &:hover {
        color: var(--el-link-hover-text-color);
    }
}
</style>