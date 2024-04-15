<template>
  <el-upload 
  action="#"
  :http-request="uploadIcon"
  list-type="picture-card" 
  :limit="1"
  :on-exceed="handleExceed"
  :file-list="fileList">
    
    <el-icon><Plus /></el-icon>
    <template #file="{ file }">
      <div>
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in /></el-icon>
          </span>
          <span
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <el-icon><Delete /></el-icon>
          </span>
        </span>
       
      </div>
    </template>
  </el-upload>
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>
<script  setup>
import { ref,onMounted,watch} from 'vue'
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import { ElMessage, tagEmits } from 'element-plus';
import  userApi  from '../api/user'
const props = defineProps({
  fileUrl: {
    type: String
  },
});
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const fileAfterValue =ref([])


const emits = defineEmits(["updateFileValue"]);


const fileList = ref([])

// 移除文件
const handleRemove = (file) => {
  fileList.value = []
}
// 文件超出限制
const handleExceed = (files, fileList) =>{
    // 当超出文件数量限制时的处理方法
    ElMessage.error(`当前限制选择 1 个文件`);
}
// 文件预览
const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true
}


// 处理文件上传操作
const uploadIcon = async (file) => {
  const formData = new FormData();
  formData.append("file", file.file);
  const res = await userApi.uploadFile(formData);
  if (res.data) {
    fileAfterValue.value.push({
      remark: file.file.type,
      url: res.data,
    })
    emits("updateFileValue",fileAfterValue)
    fileAfterValue.value = []
  }
}

watch(() => props.fileUrl, (newValue,oldValue) => {
  if(newValue){
    fileList.value = [{ url: newValue }]
  }else{
    fileList.value = []
  }
},{
  immediate: true,
  deep: true
})



</script>
<style lang="scss" scoped>
img{
  width: 100%;
}
</style>

