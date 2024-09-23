import router from './index'
import {getAccessToken} from '@/utils/cookie'
import store from "../store";

// 白名单列表
const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
    if (getAccessToken()) {
        // 已登录且要跳转的是登录页
        if (to.path === '/login') {
            next({path: '/'})
        } else {
            // 用户已经登录 路由的访问权限
            if (!store.state.permission.permission) {
                try {
                    // 获取用户信息
                    await store.dispatch('user/FETCH_USER_INFO');
                    // 用户权限设置
                    await store.dispatch('permission/FETCH_PERMISSION').then(() => {
                        next({
                            path: to.path
                        })
                    })
                } catch (error) {
                    store.commit('user/REMOVE_TOKEN')
                    store.commit('user/CLEAR_USER_INFO')
                    next(`/login?redirect=${to.fullPath}`)
                }
            } else {
                // store中存在权限
                if (to.path !== '/login') {
                    next();
                } else {
                    next(from.fullPath);
                }
            }
            next()
        }
    } else {
        // 在免登录白名单，直接进入
        if (whiteList.includes(to.path)) {
            next()
        } else {
            // 否则重定向到登录页
            next(`/login?redirect=${to.fullPath}`)
        }
    }
})
