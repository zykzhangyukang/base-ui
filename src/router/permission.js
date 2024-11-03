import router from './index'
import {getAccessToken} from '@/utils/cookie'
import store from "../store";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: true });


// 白名单列表
const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
    NProgress.start();
    document.title = getPageTitle(to.meta.title || to.name)

    if (getAccessToken()) {
        // 已登录且要跳转的是登录页
        if (to.path === '/login') {
            next({path: '/'})
        } else {
            if (!store.state.permission.permission) {
                try {
                    // 获取用户信息
                    await store.dispatch('user/FETCH_USER_INFO');
                    // 用户权限设置
                    await store.dispatch('permission/FETCH_PERMISSION').then(() => {
                        next({
                            path: to.fullPath
                        })
                    })
                } catch (error) {
                    store.commit('user/REMOVE_TOKEN')
                    next(`/login?redirect=${to.fullPath}`)
                }
            } else {
                if (to.path !== '/login') {
                    next();
                } else {
                    next(from.fullPath);
                }
            }
            next()
        }
    } else {
        if (whiteList.includes(to.path)) {
            next()
        } else {
            next(`/login?redirect=${to.fullPath}`)
        }
    }
})

router.afterEach(async(to, from) => {
    NProgress.done();
})



function getPageTitle(pageTitle) {
    let titleStr = ''
    if (pageTitle) {
        titleStr += `${pageTitle}`
    }
    return titleStr + ' - ' + '后台管理手脚架'
}
