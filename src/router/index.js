import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout'

Vue.use(Router)

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
        path: '401',
        name: '401',
        component: () => import('../views/error-page/401'),
        hidden: true,
        meta: {title: '401'}
    },
    {
        path: '404',
        name: '404',
        component: () => import('../views/error-page/404'),
        hidden: true,
        meta: {title: '404'}
    },
]

export const asyncRoutes = [
    {
        path: '',
        name: 'Layout',
        component: Layout,
        redirect: '/home',
        meta: {
            title: '首页',
            icon: 'vue-dsn-icon-biaoge'
        },
        children: [
            {
                path: 'home',
                name: 'Home',
                component: () => import('../views/Home'),
                meta: {
                    title: '首页',
                    icon: 'vue-dsn-icon-index',
                    fixed: true
                }
            },
            {
                path: '/auth/user-list',
                name: 'UserList',
                component: () => import('@/views/auth/UserList.vue'),
                meta: {
                    icon: 'el-icon-user',
                    title: '用户管理'
                }
            },
            {
                path: '/auth/role-list',
                name: 'RoleList',
                component: () => import('@/views/auth/RoleList.vue'),
                meta: {
                    icon: 'el-icon-suitcase-1',
                    title: '角色管理'
                }
            },
            {
                path: '/auth/resc-list',
                name: 'RescList',
                component: () => import('@/views/auth/RescList.vue'),
                meta: {
                    icon: 'el-icon-takeaway-box',
                    title: '资源管理'
                }
            },
            {
                path: '/auth/func-list',
                name: 'FuncList',
                component: () => import('@/views/auth/FuncList.vue'),
                meta: {
                    icon: 'el-icon-folder-opened',
                    title: '功能管理'
                }
            }
        ]
    },
    {
        path: '/error-page',
        name: 'ErrorPage',
        component: Layout,
        redirect: '/error-page/page-401',
        meta: {
            title: '错误页面',
            icon: 'vue-dsn-icon-bug'
        },
        children: [
            {
                path: 'page-401',
                name: 'Page401',
                component: () => import('../views/error-page/401'),
                meta: {
                    title: '401页面'
                }
            },
            {
                path: 'page-404',
                name: 'Page404',
                component: () => import('../views/error-page/404'),
                meta: {
                    title: '404页面'
                }
            }
        ]
    }
]

const routes = [...constantRoutes, ...asyncRoutes]

export default new Router({
    routes
})
