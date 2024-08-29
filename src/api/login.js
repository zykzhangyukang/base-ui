import request from '../request'

export function login(data) {
  return request({
    url: '/auth/user/login',
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
