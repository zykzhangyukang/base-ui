import request from '../request'

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
