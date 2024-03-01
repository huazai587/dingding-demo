<template>
    <div>
        <el-container class="home-container">
            <!-- header -->
            <el-header>
                <el-row>
                    <el-col :span="4">
                        <!-- <p class="system-name">安徽中烟AI问答机器人管理后台</p> -->
                    </el-col>
                    <el-col :offset="12" :span="8" style="min-width: 150px">
                        <el-dropdown style="float: right; margin: 20px 10px">
                            <span class="el-dropdown-link" style=" cursor: pointer">
                                超级管理员 &nbsp;&nbsp; <el-icon class="el-icon--right">
                                    <arrow-down />
                                </el-icon>
                            </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click.native="logout">退出系统</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                        <el-avatar  :src="avatar" style="margin: 10px; float: right"></el-avatar>
                    </el-col>
                </el-row>
            </el-header>

            <el-container style="overflow: auto">
                <!-- 菜单 -->
                <el-aside>
                    <div class="toggle-button" @click="isCollapse = !isCollapse">
                        <el-icon :size="20">
                            <Expand v-if="isCollapse" />
                            <Fold v-if="!isCollapse" />
                        </el-icon>
                    </div>
                    <el-menu router :default-active="activePath" class="el-menu-vertical-demo" :collapse="isCollapse">
                        <el-menu-item index="/scene/list" @click="saveActiveNav('/scene/list')">
                            <el-icon>
                                <Monitor />
                            </el-icon>
                          <span>场景管理</span>
                        </el-menu-item>
                        <el-menu-item index="/document/list" @click="saveActiveNav('/document/list')">
                            <el-icon>
                                <Document />
                            </el-icon>
                            <span>文档管理</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-container>
                    <el-main>
                        <!-- 面包屑 -->
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item :to="{ path: '/' }">
                                <el-icon><House /></el-icon>
                            </el-breadcrumb-item>
                            <el-breadcrumb-item>
                                <a href="/">{{ menuName }}</a>
                            </el-breadcrumb-item>
                        </el-breadcrumb>
                        <!-- 主要内容 -->
                        <router-view></router-view>
                    </el-main>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>
<script setup>
import { onBeforeMount, ref } from 'vue';
import avatar from "../assets/img/avator.png"
import { useRouter } from 'vue-router'
const router = useRouter();
let menuList = ref([
    {
        path: "/scene/list",
        name: "场景管理"
    },
    {
        path: "/document/list",
        name: "文档管理"
    }
]);
// 挂载 DOM 之前
onBeforeMount(() => {
    activePath.value = sessionStorage.getItem("activePath")
        ? sessionStorage.getItem("activePath")
        : "/index";
    menuName.value = menuList.value.find((item) => item.path === activePath.value).name;
})
let isCollapse = ref(false);
let activePath = ref("");
let menuName = ref("");
// 保存链接的激活状态
const saveActiveNav = (path) => {
    menuName.value = menuList.value.find((item) => item.path === path).name;
    sessionStorage.setItem("activePath", path);
    activePath.value = path;
}
const logout = () => {
    // 清除缓存
    sessionStorage.clear();
    router.push("/login");
}
</script>

<style scoped>
.home-container {
    position: absolute;
    height: 100%;
    top: 0px;
    left: 0px;
    width: 100%;
    background: #f2f3f5;
}
.el-breadcrumb{
    margin-bottom: 20px;
}
.el-header {
    background: #fff;
    padding: 0 10px;
    overflow: hidden;
}

.system-name {
font-size: 18px;
background: url("../assets/img/logo.png") no-repeat left center;
  height: 35px;
  line-height: 35px;
  padding-left: 45px;
  color: #000;
  background-size: 35px 35px;
  font-weight: bold;
}

.el-aside {
    background: white;
    width: auto !important;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}



.toggle-button {
    background-color: #d9e0e7;
    font-size: 18px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
    color: black;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}

.el-menu-item.is-active {
    color: #2661ef !important;
}
</style>