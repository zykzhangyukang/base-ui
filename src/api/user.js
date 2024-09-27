import request from '../request'

export function switchUserLogin(data) {
    return request({
        url: '/auth/user/switch/login',
        method: 'post',
        data
    })
}

export function getUserPage(data) {
    return request({
        url: '/auth/user/page',
        method: 'post',
        data
    })
}

export function saveUser(data) {
    return request({
        url: '/auth/user/save',
        method: 'post',
        data
    })
}

export function updateUser(data) {
    return request({
        url: '/auth/user/update',
        method: 'put',
        data
    })
}

export function deleteUser(id) {
    return request({
        url: '/auth/user/delete?userId='+id,
        method: 'delete',
    })
}

export function enableUser(id) {
    return request({
        url: '/auth/user/enable?userId='+id,
        method: 'put',
    })
}

export function disableUser(id) {
    return request({
        url: '/auth/user/disable?userId='+id,
        method: 'put',
    })
}
export function getUserDetail(id) {
    return request({
        url: '/auth/user/detail?userId='+id,
        method: 'get',
    })
}

export function getUserRoleInit(id) {
    return request({
        url: '/auth/user/role/update/init?userId='+id,
        method: 'get',
    })
}

export function updateUserRole(data) {
    return request({
        url: '/auth/user/role/update',
        method: 'put',
        data
    })
}

