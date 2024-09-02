import request from '../request'

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

export function getRescDetail(id) {
    return request({
        url: '/auth/resc/detail?rescId='+id,
        method: 'get',
    })
}
