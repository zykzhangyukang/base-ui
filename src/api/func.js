import request from '../request'

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

export function updateFunc(data) {
    return request({
        url: '/auth/func/update',
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

