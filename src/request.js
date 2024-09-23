import axios from 'axios'
import {Message} from 'element-ui'
import store from "./store";
import {getAccessToken, getExpiresIn} from './utils/cookie'

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

          if (isTokenExpiringSoon() && !isRefreshing) {
              isRefreshing = true;
              await store.dispatch('user/REFRESH_TOKEN').then(newToken => {
                  isRefreshing = false;
                  // 重新发送挂起的请求
                  requests.forEach(cb => cb(newToken));
                  requests = []; // 清空挂起的请求
              }).catch(error => {
                  console.error('刷新Token失败', error);
                  isRefreshing = false;
                  store.commit('user/REMOVE_TOKEN');
                  store.commit('user/CLEAR_USER_INFO');
                  location.reload()
              });

          } else if (isRefreshing) {

              // 请求挂起
              return new Promise((resolve) => {
                  requests.push((token) => {
                      config.headers['Authorization'] = 'Bearer ' + token;
                      resolve(config);
                  });
              });
          }

      }
      config.headers['Content-Type'] = 'application/json'
      return config
  },
  error => {
    console.log(error)
    Promise.reject(error)
  }
)

// response 拦截器设置
service.interceptors.response.use(
  response => {
    const data = response.data
    const code = data.code
    const message = data.msg
    if (code === 200) {
      return data
    } else if(code === 405){
        Message({
            type: 'warning',
            message
        })
        return Promise.reject('error')
    }else {
      Message({
        type: 'error',
        message
      })
      return Promise.reject('error')
    }
  },
  error => {
    const code = error.response.data.status
    if (!code) {
      Message({
        type: 'error',
        message: '接口请求失败'
      })
    }
    return Promise.reject(error)
  }
)



function isTokenExpiringSoon() {
    const expiresIn = getExpiresIn();
    if (!expiresIn) {
        return true;
    }
    console.log("token过期剩余时间:", expiresIn - new Date().getTime() )
    return expiresIn - new Date().getTime() < 15 * 1000 * 60;
}


export default service
