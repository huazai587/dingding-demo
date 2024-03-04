<template>
    <div style="margin-bottom: 20px;">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">
                <el-icon><House /></el-icon>
            </el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in tabs" :to="item.path">
            {{item.name}}
            </el-breadcrumb-item>

        </el-breadcrumb>
    </div>
</template>

<script setup>
import { ref,watch,onBeforeMount } from 'vue';
import { useRoute } from 'vue-router'
const route = useRoute();

const tabs = ref([])
    
const getBreadCom = () => {
    let mached = route.meta.breadcrumb
    console.log(mached)
    //设置面包屑的数据
    tabs.value = mached.filter(item => item.path !== '/home')
   }
   
    getBreadCom()
    // 监听路径的改变,如果发生变化了，执行方法
    watch(() =>route.path,() => getBreadCom())


// 挂载 DOM 之前
onBeforeMount(() => {

})
</script>

<style lang="scss" scoped>


</style>