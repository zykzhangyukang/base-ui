import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout'

Vue.use(Router)

//解决编程式路由往同一地址跳转时会报错的情况
const originalPush = Router.prototype.push;
const originalReplace = Router.prototype.replace;
//push
Router.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) {
        return originalPush.call(this, location, onResolve, onReject);
    }
    return originalPush.call(this, location).catch(err => err);
};
//replace
Router.prototype.replace = function push(location, onResolve, onReject) {
    if (onResolve || onReject) {
        return originalReplace.call(this, location, onResolve, onReject);
    }
    return originalReplace.call(this, location).catch(err => err);
};

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
        path: '/401',
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
                    title: '系统首页',
                    icon: 'vue-dsn-icon-index',
                    fixed: true
                }
            }
        ]
    },
]

const routes = [...constantRoutes]
const router  =new Router({
    routes
});
export default router
