<template>
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
                        <el-button type="primary" :icon="Search" style="flex-shrink: 0; flex: none;" @click="searchCar">搜索</el-button>
                        <el-button type="info" :icon="RefreshLeft" style="flex-shrink: 0; flex: none;" @click="resetSearch">重置</el-button>
                    </div>
                </el-form>
            </div>
            <!-- 按钮 -->
            <div class="btn-wrap">
                <el-button type="primary" :icon="Plus">上传</el-button>
                <el-button type="primary" :icon="Plus">批量上传</el-button>
                <el-button type="danger" :icon="Delete">批量删除</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%;margin-top:20px">
                <el-table-column prop="name" label="姓名" width="180" />
                <el-table-column prop="age" label="年龄" width="180" />
                <el-table-column label="操作" width="330">
                    <template #default="scope">
                        <el-button type="danger" size="small" @click="deleteUser(scope.row.id)">删除</el-button>
                        <el-button size="small"
                            @click="() => router.push({ path: '/user/detail', query: { id: scope.row.id } })">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination style="margin-top:20px" :current-page="searchForm.current" :page-size="searchForm.size"
                :page-sizes="[10, 20, 30, 40]" layout="->,total, sizes, prev, pager, next, jumper" :total="total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-card>
</template>

<script setup>
import userApi from "../../api/user";
import { onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, RefreshLeft, Plus, Delete} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
const router = useRouter();
// Dom 挂载之后
onMounted(() => {
    // getUserList();
})
// 所属场景
const sceneList = [
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
  }]
// 所属场景
const docTypeList = [
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
  }]

// 用户数据
let tableData = ref([]);
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
const handleSizeChange = (size) => {
    searchForm.size = size;
    getUserList();
}
const handleCurrentChange = (current) => {
    searchForm.current = current;
    getUserList();
}
const searchUser = () => {
    searchForm.current = 1;
    getUserList();
}
// 删除用户
const deleteUser = (id) => {
    ElMessageBox.confirm(
        '确定要删除该用户信息吗?',
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
</style>