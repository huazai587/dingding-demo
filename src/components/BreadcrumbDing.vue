<template>
    <div style="margin-bottom: 20px;">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">
                <el-icon @click="goHome()"><House /></el-icon>
            </el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in tabs" :to="item.path">
            {{item.meta.title}}
            </el-breadcrumb-item>

        </el-breadcrumb>
    </div>
</template>

<script setup>
import { ref,watch,onMounted } from 'vue';
import { useRoute } from 'vue-router'
const route = useRoute();

const tabs = ref([])
    
//onMounted
onMounted(()=>{
      let matched = route.matched;//获取菜单对应的路由信息
      matched = matched.filter(item=>item.meta.title != "主页");
      tabs.value = matched;
    })

// 监听路径的改变,如果发生变化了，执行方法
watch(() =>route.matched,(newVal,oldVal)=>{
      let matched = newVal;
      matched = matched.filter(item=>item.meta.title != "主页");
      tabs.value = matched;//更新路由菜单数组
})
const goHome = ()=>{
        sessionStorage.setItem("activePath", '/scene');
}


</script>

<style lang="scss" scoped>


</style>