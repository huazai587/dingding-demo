<template>
    <el-card>
            <template #header>
                <div class="card-header" >
                    <span>场景列表</span>
                </div>
            </template>
            <div style="margin-bottom: 20px;">
                <el-input style="width:300px; margin-right: 20px;"
                :suffix-icon="Search"
                v-model="searchForm.name" placeholder="请输入场景名称"
                >
                </el-input>
                <el-button type="primary"  @click="searchUser" icon="Plus">新增场景</el-button>
            </div>
            <div class="box-card">
            <el-card  v-for="item in sceneList" :body-style="{ paddingTop:'0px'}">
                <template #header>
                <div class="card-header">
                    <span class="card-title">
                        <el-icon><User /></el-icon>
                        <span>{{ '物流' }}</span>
                        <el-tag type="success">已开启</el-tag>
                    </span>
                    <el-icon style="cursor: pointer;">
                        <Delete />
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
                        <el-button class="button" type="primary">编辑场景</el-button>
                        <el-button class="button" type="info">文档管理</el-button>
                    </div>
                </template>
            </el-card>
        </div>
    </el-card>
</template>

<script setup>
import userApi from "../../api/user";
import { onMounted, reactive, ref } from "vue";
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router'
const router = useRouter();
// Dom 挂载之后
onMounted(() => {
    // getUserList();
})
// 用户数据
let sceneList = ref([1,2,3,4]);
let total = ref(0);
// 搜索条件
const searchForm = reactive({
    current: 1,
    size: 10,
    name: ''
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
  :deep(.el-card__footer) {
    border: none !important;
    padding-top: 0;
    overflow: hidden;
  }
.box-card {
  display: flex;
  justify-content: space-between; 
  flex-wrap: nowrap; 
  :deep(.el-card__header){
   padding-bottom: 0px;
   overflow: hidden;
  }
  flex-grow: 1; 
    flex-basis: 0; 
   margin-right: 20px;
   &:last-child{
     margin-right: 0;
   }
   .card-header {
   display: flex;
   justify-content: space-between;
   align-items: center;
   .card-title{
     display: flex;
     align-items: center;
     justify-content: center;
     flex-wrap: wrap;
     gap: 10px;
   }
   }
   .card-item{
    font-size: 12px;
    color: gray;
   }
  }


</style>