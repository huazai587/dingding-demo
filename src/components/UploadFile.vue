<template>
    <el-upload 
    :file-list="fileList" 
    class="upload-demo"
    action="#" 
    ref="uploadrefs"
    accept=".md,.txt,.pdf,.PDF,.doc,.docx"
    :before-upload="beforeUpload"
    :http-request="uploadIcon"
    :disabled="!props.isUpload"
    >
        <el-button type="primary"  :disabled="!props.isUpload">上传文档</el-button>
    </el-upload>
</template>
<script  setup>
import { ref,onMounted,watch } from 'vue'
import  userApi  from '../api/user'
import { ElMessage, ElMessageBox } from 'element-plus';
const props = defineProps({
  fileUrlList: {
    type: Array
  },
  isUpload: {
    type: Boolean
  },
});

const fileList = ref([])
const fileAfterValue =ref([])
const uploadrefs = ref(null);
const emits = defineEmits(["updateFileValue"]);


const uploadIcon = async (file) => {
  console.log(file)
  const formData = new FormData();
  let index = file.file.name.lastIndexOf('.')
  let fileType = file.file.name.split(".").slice(-1)[0].toLowerCase();
  formData.append("file", file.file);
  const res = await userApi.uploadFile(formData);
  if (res.data) {
    fileAfterValue.value.push({
      type: fileType,
      url: res.data,
      name: file.file.name.substring(0,index)
    })
     emits("updateFileValue",fileAfterValue)
    fileAfterValue.value = []
  }
}

// 上传文件的类型 大小限制判断 .md,.txt,.pdf,.PDF,.doc.docx  单文件大小不超过20M
const beforeUpload = (file) => {  
      const typeList = ["md", "txt", "pdf", "doc", "docx"];
      let fileType = file.name.split(".").slice(-1)[0].toLowerCase();
      if (typeList.indexOf(fileType) === -1) {
        ElMessage.error("文档格式只能为md,.txt,.pdf,.doc,.docx");
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 20;
      if(file.size === 0){
        ElMessage.error("上传文档大小不能为0");
        return false;
      }
      if (!isLt2M) {
        ElMessage.error("上传文档大小不能超过 20MB!");
        return false;
      }
    }

const clear = () => {
  uploadrefs.value.clearFiles()
}

watch(() => props.fileUrlList, (newValue,oldValue) => {
  fileList.value = newValue
},{
  immediate: true,
  deep: true
})
onMounted(() => {
})

//暴露state和方法
defineExpose({
  clear,
})
</script>
<style lang="scss" scoped>
:deep(.el-upload-list){
  width: 200px;
}
</style>

