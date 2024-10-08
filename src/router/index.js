import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../layout'

Vue.use(VueRouter)

/**
 * hidden: true                  如果设置为 true，该项菜单将不会显示在菜单栏中(默认为 false)
 * meta : {
    title: 'title'               菜单名
    icon: 'icon-name'            图标名
    fixed: true                  如果设置为 true，该项 tag 将一直存在 tag 栏中(默认为 false)
  }
 * */
export const constantRoutes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login'),
        hidden: true,
        meta: {title: '登录'}
    },
    {
        path: '/error',
        name: 'ErrorLayout',
        component: Layout,
        redirect: '/error/404',
        children: [
            {
                path: '404',
                name: '404',
                hidden: true,
                component: () => import('../views/error/404'),
                meta: {title: '页面不存在'},
            },
            {
                path: '401',
                name: '401',
                component: () => import('../views/error/401'),
                hidden: true,
                meta: {title: '页面无权限'},
            },
        ]
    },
]

export const DynamicRoutes = [
    {
        path: '/',
        name: 'Layout',
        component: Layout,
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('../views/Dashboard.vue'),
                meta: {
                    title: '系统首页',
                    icon: 'vue-icon-a-1_daohang-dakai-54',
                    fixed: true
                }
            }
        ]
    },
]

const router = new VueRouter({
    // 不适用 history 模式
    routes: constantRoutes
});
router.$addRoutes = (params) => {
    params.forEach((route) => {
        router.addRoute(route);
    })
    // 匹配所以重定向最后添加
    router.addRoute({
        path: "/:pathMatch(.*)",
        name: 'Redirect',
        redirect: '/error/404'
    });
};

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

export default router
