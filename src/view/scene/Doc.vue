<template>
    <el-card>
        <template #header>
            <div class="card-header">
                <span>文档列表</span>
            </div>
        </template>
        <div class="btn-wrap">
            <el-input style="width:300px; margin-right: 20px;" :suffix-icon="Search" @change="searchScene"
                v-model="docName" placeholder="请输入文档名称">
            </el-input>
            <el-button type="primary" :icon="Plus" @click="downloadDoc">上传</el-button>
            <el-button type="primary" :icon="Plus" @click="downloadDoc">批量上传</el-button>
            <el-button type="danger" :icon="Delete" @click="deleteDoc">批量删除</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%;margin-top:20px"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="number" label="文档编号" width="180" />
            <el-table-column prop="name" label="文档名称" width="180" />
            <el-table-column prop="type" label="文件类型" width="180" />
            <el-table-column prop="date" label="创建时间" width="180" />
            <el-table-column label="操作">

                <template #default="scope">
                    <el-link type="primary" @click="downloadDoc" :underline="false">下载</el-link>
                    <el-link type="primary" @click="editDoc" :underline="false">编辑</el-link>
                    <el-link type="danger" @click="deleteDoc" :underline="false">删除</el-link>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination style="margin-top:20px" :current-page="pageNo" :page-size="pageSize"
            :page-sizes="[10, 20, 30, 40]" layout="->,total, sizes, prev, pager, next, jumper" :total="total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-card>
    <!-- 新增编辑文档 -->
    <el-dialog v-model="dialogFormVisible" title="新增文档" width="500">
        <el-form :model="sceneform" :rules="rules" label-width="auto">
            <el-form-item label="文档名称" :label-width="formLabelWidth" required>
                <el-input v-model="sceneform.name" autocomplete="off" placeholder="请输入场景名称" />
            </el-form-item>
            <el-form-item label="文档编号" :label-width="formLabelWidth" required>
                <el-input v-model="sceneform.sort" autocomplete="off" placeholder="请输入场景序号" />
            </el-form-item>
            <el-form-item label="文档上传" :label-width="formLabelWidth" required>
                <!-- 上传 -->
    <el-upload v-model:file-list="fileList" class="upload-demo"
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :on-change="handleChange">
        <el-button type="primary">Click to upload</el-button>

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
                <el-button type="primary" @click="saveDoc">
                    保存
                </el-button>
                <el-button @click="cancleDoc">关闭</el-button>
            </div>
        </template>
    </el-dialog>
   
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import type { FormInstance, FormRules } from 'element-plus'
import { Search, RefreshLeft, Plus, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import type { UploadProps, UploadUserFile } from 'element-plus'
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

let docName = ref('')
let pageNo = ref(1)
let pageSize = ref(10);
let total = ref(100)
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
const downloadDoc = () => {
    dialogFormVisible.value = true
}
const saveDoc = () => {
    dialogFormVisible.value = false
}
const cancleDoc = () => {
    dialogFormVisible.value = false
}
const editDoc = () => {
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
        '您即将删除该场景，所属场景下的文档将同步被取消分类，进入"未分配"状态，请确认后操作。',
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
const tableData = [
    {
        date: '2016-05-03',
        name: 'Tom',
        number: 1,
        type: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-03',
        name: 'Tom',
        number: 1,
        type: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-03',
        name: 'Tom',
        number: 1,
        type: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-03',
        name: 'Tom',
        number: 1,
        type: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-03',
        name: 'Tom',
        number: 1,
        type: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-03',
        name: 'Tom',
        number: 1,
        type: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-03',
        name: 'Tom',
        number: 1,
        type: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-03',
        name: 'Tom',
        number: 1,
        type: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-03',
        name: 'Tom',
        number: 1,
        type: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-03',
        name: 'Tom',
        number: 1,
        type: 'No. 189, Grove St, Los Angeles',
    }
]
</script>

<style lang="scss" scoped>
.el-link {
    margin-right: 10px;
}
</style>