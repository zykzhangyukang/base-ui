import axios from 'axios'
import { Message } from 'element-ui'
import store from "./store";
import {getAccessToken, getExpiresIn, getRefreshToken} from './utils/cookie'
import {queryRefreshToken} from "@/api/login";

// 创建axios实例
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
    timeout: 120000
})

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
                    const newToken = await queryRefreshToken(getRefreshToken());
                    console.log("new-token",newToken)
                    isRefreshing = false;

                    // 重新设置新的token，重新发送所有挂起的请求
                    requests.forEach(cb => cb(newToken));
                    requests = [];
                } catch (error) {
                    console.error('刷新Token失败', error);
                    isRefreshing = false;
                    store.commit('user/REMOVE_TOKEN');
                    store.commit('user/CLEAR_USER_INFO');
                    location.reload();
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
            Message({
                type: 'warning',
                message
            });
            return Promise.reject('error');
        } else {
            Message({
                type: 'error',
                message
            });
            return Promise.reject('error');
        }
    },
    error => {
        const code = error.response?.data?.status;
        if (!code) {
            Message({
                type: 'error',
                message: '接口请求失败'
            });
        }
        return Promise.reject(error);
    }
);

// 判断token是否即将过期
function isTokenExpiringSoon() {
    const expiresIn = getExpiresIn();
    if (!expiresIn) {
        return true;
    }
    console.log("token过期剩余时间:", expiresIn - new Date().getTime());
    return expiresIn - new Date().getTime() < 20 * 1000;
}

export default service;
