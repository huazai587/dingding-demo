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
      breadcrumb:[{name:"主页",path:"/home"}]
    },
    component: () => import("../view/Home.vue"),
    redirect: "/scene",
    children: [
      {
        path: "/scene",
        name: "场景管理",
        meta: {
            breadcrumb:[{name:"主页",path:"/home"},{name:"场景管理",path:"/scene"}]
        },
        component: () => import("../view/scene/Index.vue")
      },
      {
            path: "/document-list/:id",
            name: "文档列表",
            meta: {
                breadcrumb:[
                    {name:"主页",path:"/home"},
                    {name:"场景管理",path:"/scene"},
                    {name:"文档列表",path:"/scene/document-list"}]
            },
            component: () => import("../view/scene/Doc.vue"),
          },
      {
        path: "/document-manager",
        name: "文档管理",
        meta: {
            breadcrumb:[
                {name:"主页",path:"/home"},
                {name:"文档管理",path:"/document-manager"}
            ]
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
  // const token= sessionStorage.getItem('token')
  // if (!token) {
  //   return next('/login')
  // } else {
  //   next()
  // }
  return next();
});

// 导出路由
export default router;
