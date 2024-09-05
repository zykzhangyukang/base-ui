import request from '../request'

export function getRolePage(data) {
    return request({
        url: '/auth/role/page',
        method: 'post',
        data
    })
}

export function saveRole(data) {
    return request({
        url: '/auth/role/save',
        method: 'post',
        data
    })
}

export function updateRole(data) {
    return request({
        url: '/auth/role/update',
        method: 'put',
        data
    })
}

export function deleteRole(id) {
    return request({
        url: '/auth/role/delete?roleId='+id,
        method: 'delete',
    })
}

export function getRoleDetail(id) {
    return request({
        url: '/auth/role/detail?roleId='+id,
        method: 'get',
    })
}