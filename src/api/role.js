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

export function getRoleUserInit(id) {
    return request({
        url: '/auth/role/user/update/init?roleId='+id,
        method: 'get',
    })
}

export function updateRoleUser(data) {
    return request({
        url: '/auth/role/user/update',
        method: 'put',
        data
    })
}

export function getRoleFuncInit(id) {
    return request({
        url: '/auth/role/func/update/init?roleId='+id,
        method: 'get',
    })
}

export function roleFuncUpdate(data) {
    return request({
        url: '/auth/role/func/update',
        method: 'put',
        data
    })
}

export function roleFuncUpdateCheck(data) {
    return request({
        url: '/auth/role/func/update/check',
        method: 'post',
        data
    })
}

