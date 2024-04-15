import { createRouter, createWebHashHistory } from "vue-router";
const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "登录",
    meta: {
      title: "登录",
    },
    component: () => import("../view/Login.vue"),
  },
  {
    path: "/home",
    name: "主页",
    meta: {
      title: "主页",
    },
    component: () => import("../view/Home.vue"),
    redirect: "/scene",
    children: [
      {
        path: "/scene",
        name: "场景管理",
        meta: {
          title: "场景管理",
          showFather: true,
        },
        component: () => import("../view/scene/SceneManager.vue"),
        children: [
          {
            path: "/scene/document-list/:id",
            name: "文档列表",
            meta: {
              title: "文档列表",
              showFather: false,
            },
            component: () => import("../view/scene/DocumentList.vue"),
          },
        ],
      },
      {
        path: "/document-manager",
        name: "文档管理",
        meta: {
          title: "文档管理",
        },
        component: () => import("../view/document/Index.vue"),
      },
    ],
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
// 挂载路由导航守卫：to表示将要访问的路径，from表示从哪里来，next是下一个要做的操作
router.beforeEach((to, from, next) => {
  // 修改页面 title
  if (to.meta.title) {
    document.title = "安徽中烟AI问答机器人管理后台 - " + to.meta.title;
  }
  // 放行登录页面
  if (to.path === "/login") {
    return next();
  }
  // 获取token
  //页面是否登录，本地存储中是否有token的数据
  let K = localStorage.getItem("token");
  try {
    K = JSON.parse(K);
  } catch (err) {}
  if (K) {
    let date = new Date().getTime();
    // 如果大于就是过期了
    if (date - K.startTime > K.endTime) {
      localStorage.removeItem("token");
      return next("/login");
    } else {
      return next();
    }
  }else{
    return next("/login");
  }
});

// 导出路由
export default router;
