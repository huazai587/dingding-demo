import { createRouter, createWebHashHistory } from 'vue-router'
const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录'
        },
        component: () => import('../view/Login.vue')
    },
    {
        path: '/home',
        name: '主页',
        meta: {
            title: '主页'
        },
        component: () => import('../view/Home.vue'),
        redirect: '/scene/list',
        children: [
            {
                path: '/scene/list',
                meta: {
                    title: '场景管理'
                },
                component: () => import('../view/scene/Index.vue'),
            },
            {
                path: '/scene/detail',
                meta: {
                    title: '场景详情'
                },
                component: () => import('../view/scene/Detail.vue'),
            },
            {
                path: '/document/list',
                meta: {
                    title: '文档管理'
                },
                component: () => import('../view/document/Index.vue'),
            },
            {
                path: '/document/detail',
                meta: {
                    title: '文档详情'
                },
                component: () => import('../view/document/Detail.vue'),
            }
        ]
    },
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})
// 挂载路由导航守卫：to表示将要访问的路径，from表示从哪里来，next是下一个要做的操作
router.beforeEach((to, from, next) => {
    // 修改页面 title
    if (to.meta.title) {
      document.title = '安徽中烟AI问答机器人管理后台 - ' + to.meta.title
    }
    // 放行登录页面
    if (to.path === '/login') {
      return next()
    }
    // 获取token
    // const token= sessionStorage.getItem('token')
    // if (!token) {
    //   return next('/login')
    // } else {
    //   next()
    // }
    return next()
  })
  
// 导出路由
export default router