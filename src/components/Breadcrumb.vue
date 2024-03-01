<template>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">
                <el-icon><House /></el-icon>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <a href="/">{{ menuName }}</a>
            </el-breadcrumb-item>
        </el-breadcrumb>
   
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter();

const menuName = router.currentRoute.value.meta.menuName;

// 挂载 DOM 之前
onBeforeMount(() => {
    console.log(router)
})
</script>

<style lang="scss" scoped>


</style>