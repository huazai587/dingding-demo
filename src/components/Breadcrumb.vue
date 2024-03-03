<template>
    <div style="margin-bottom: 20px;">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">
                <el-icon><House /></el-icon>
            </el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in tabs" :to="item.path">
            {{item.meta.title}}
            </el-breadcrumb-item>

        </el-breadcrumb>
    </div>
</template>

<script setup>
import { ref,watch,onBeforeMount } from 'vue';
import { useRoute } from 'vue-router'
const route = useRoute();
// const route = useRoute()
//    定义导航数据,设置类型，否则赋值会报错
    const tabs = ref([])
    
const getBreadCom = () => {
    let mached = route.matched.filter(item => item.meta.title)
    console.log(route.matched,mached)
    // 第一个路径如果不是首页，需要在匹配路径前面拼接一个首页
    // const first = mached[0]
    // if(first.path != "/dashboard") {
    //     mached = [{ path: '/dashboard',meta: {title: '首页'}}].concat(mached)
    // }
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