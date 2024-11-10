import axios from 'axios'
import store from "./store";
import router from "./router";
import MessageOnce from '@/utils/messageonce'
import {getAccessToken, getExpiresIn} from './utils/cookie'

// 创建axios实例
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
    timeout: 120000
})

const messageOnce = new MessageOnce()
let isRefreshing = false;
let requests = [];

// request拦截器设置
service.interceptors.request.use(
    async config => {
        if (getAccessToken()) {
            config.headers['Authorization'] = 'Bearer ' + getAccessToken();

            // 如果token即将过期并且当前没有正在刷新token
            if (isTokenExpiringSoon() && !isRefreshing) {
                isRefreshing = true;
                try {

                    const newToken = await store.dispatch('user/REFRESH_TOKEN');
                    isRefreshing = false;

                    // 重新设置新的token，重新发送所有挂起的请求
                    config.headers['Authorization'] = `Bearer ${newToken}`;
                    requests.forEach(cb => cb(newToken));
                    requests = [];
                } catch (error) {
                    console.error('刷新Token失败', error);
                    isRefreshing = false;
                    store.commit('user/REMOVE_TOKEN')
                    router.push('/login').then(r => {
                        messageOnce.error('登录已过期，请重新登录');
                    });
                }
            } else if (isRefreshing) {
                // 如果正在刷新token，将当前请求挂起，等刷新完成后继续执行
                return new Promise((resolve) => {
                    requests.push((token) => {
                        config.headers['Authorization'] = 'Bearer ' + token;
                        resolve(config);
                    });
                });
            }
        }

        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject(error);
    }
)

// response拦截器设置
service.interceptors.response.use(
    response => {
        const data = response.data;
        const code = data.code;
        const message = data.msg;
        if (code === 200) {
            return data;
        } else if (code === 405) {
            messageOnce.warning({type: 'warning', message});
            return Promise.reject('error');
        }
    },
    error => {
        const code = error.response?.data?.code;
        if (!code) {
            messageOnce.error({type: 'error', message: '当前网络异常，请检查网络连接'});
        }
        if (code === 401) {
            store.commit('user/REMOVE_TOKEN')
            router.push('/login').then(r => {
                messageOnce.error({type: 'error', message: '会话已过期，请重新登录'});
            });
        } else if (code === 400) {
            messageOnce.error({type: 'error', message: '请求参数错误'});
        } else if (code === 403) {
            messageOnce.error({type: 'error', message: '很抱歉，您暂无该操作权限'})
        }else if (code === 500) {
            messageOnce.error({type: 'error', message: '服务器未知异常，请联系管理员处理'});
        }
        return Promise.reject(error);
    });

// 判断token是否即将过期
function isTokenExpiringSoon() {
    const expiresIn = getExpiresIn();
    if (!expiresIn) {
        return true;
    }
    return expiresIn - new Date().getTime() < 15 * 60 * 1000;
}

export default service;
