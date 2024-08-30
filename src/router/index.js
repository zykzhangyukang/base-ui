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
        component: () => import('../views/error/401'),
        hidden: true,
        meta: {title: '401'}
    },
    {
        path: '*',
        name: '404',
        component: () => import('../views/error/404'),
        hidden: true,
        meta: {title: '404'}
    },
]

export const DynamicRoutes = [
    {
        path: '',
        name: 'Layout',
        component: Layout,
        redirect: '/home',
        children: [
            {
                path: 'home',
                name: 'Home',
                component: () => import('../views/Home'),
                meta: {
                    title: '控制台',
                    icon: 'vue-dsn-icon-index',
                    fixed: true
                }
            }
        ]
    },
    {
        path: '/error',
        name: 'Error',
        component: Layout,
        redirect: '/error/401',
        hidden: true,
        meta: {
            title: '错误页面',
            icon: 'vue-dsn-icon-bug'
        },
        children: [
            {
                path: '401',
                name: '401',
                component: () => import('../views/error/401'),
                meta: {
                    title: '401页面'
                }
            },
            {
                path: '404',
                name: '404',
                component: () => import('../views/error/404'),
                meta: {
                    title: '404页面'
                }
            }
        ]
    }
]

const routes = [...constantRoutes]
const router  =new Router({
    routes
});
export default router
