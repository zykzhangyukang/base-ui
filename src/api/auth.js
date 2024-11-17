import request, {download} from '../request'


export function getFuncTree() {
    return request({
        url: '/auth/func/tree',
        method: 'get',
    })
}


export function saveFunc(data) {
    return request({
        url: '/auth/func/save',
        method: 'post',
        data
    })
}

export function funcRescRemove(id) {
    return request({
        url: '/auth/func/resc/remove?funcId='+id,
        method: 'delete',
    })
}

export function updateFunc(data) {
    return request({
        url: '/auth/func/update',
        method: 'put',
        data
    })
}

export function updateFuncResc(data) {
    return request({
        url: '/auth/func/resc/update',
        method: 'put',
        data
    })
}

export function deleteFunc(funcId) {
    return request({
        url: '/auth/func/delete?funcId='+funcId,
        method: 'delete',
    })
}

export function getFuncPage(data) {
    return request({
        url: '/auth/func/page',
        method: 'post',
        data
    })
}

export function getFuncDetail(id) {
    return request({
        url: '/auth/func/detail?funcId='+id,
        method: 'get',
    })
}

export function getLogPage(data) {
    return request({
        url: '/auth/log/page',
        method: 'post',
        data
    })
}


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

export function exportUserList(data,filename) {
    return download({
        url: '/auth/user/export',
        data,
        filename
    })
}

export function getPermission(data) {
    return request({
        url: '/auth/user/permission',
        method: 'get',
        data
    })
}

export function getUserDeptList() {
    return request({
        url: '/auth/dept/list',
        method: 'get',
    })
}

export function refreshResc() {
    return request({
        url: '/auth/resc/refresh',
        method: 'put'
    })
}

export function getRescPage(data) {
    return request({
        url: '/auth/resc/page',
        method: 'post',
        data
    })
}

export function saveResc(data) {
    return request({
        url: '/auth/resc/save',
        method: 'post',
        data
    })
}

export function updateResc(data) {
    return request({
        url: '/auth/resc/update',
        method: 'put',
        data
    })
}

export function deleteResc(id) {
    return request({
        url: '/auth/resc/delete?rescId='+id,
        method: 'delete',
    })
}

export function searchResc(keyword) {
    return request({
        url: '/auth/resc/search?keyword='+keyword,
        method: 'get',
    })
}

export function getRescDetail(id) {
    return request({
        url: '/auth/resc/detail?rescId='+id,
        method: 'get',
    })
}

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

export function uploadUserAvatar(formData) {
    return request({
        url: '/auth/user/upload/avatar',
        method: 'post',
        headers: {
            'content-type': 'multipart/form-data'
        },
        data: formData
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

export function getUserPhone(id) {
    return request({
        url: '/auth/user/phone?userId='+id,
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


