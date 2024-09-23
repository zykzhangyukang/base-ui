import request from '../request'
import axios from "axios";
import store from "@/store";

const serviceRefresh = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: 120000
})

export function login(data) {
  return request({
    url: '/auth/user/token',
    method: 'post',
    data
  })
}

export function getUserInfo(params) {
  return request({
    url: '/auth/user/info',
    method: 'get',
    params
  })
}

export function getPermission(data) {
  return request({
    url: '/auth/user/permission',
    method: 'get',
    data
  })
}

export function getConstantAll(data) {
  return request({
    url: '/auth/const/all',
    method: 'get'
  })
}

export async function queryRefreshToken(refreshToken) {
  try {
    // 发起刷新令牌的请求
    const {data: res} = await serviceRefresh.get(`/auth/user/refresh/token?refreshToken=${refreshToken}`);
    if (res.code === 200) {
      store.commit('user/SET_TOKEN', res.result);
      return res.result.accessToken;
    } else {
      store.commit('user/REMOVE_TOKEN');
      store.commit('user/CLEAR_USER_INFO');
      return null;
    }
  } catch (error) {
    console.error('Failed to refresh token:', error);
    store.commit('user/REMOVE_TOKEN');
    store.commit('user/CLEAR_USER_INFO')
    return null;
  }
}
