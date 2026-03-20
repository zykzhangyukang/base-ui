import request from '../request'

export function getConstantAll() {
    return request({
        url: '/common/const/all',
        method: 'get'
    })
}


export function getNotificationCount() {
    return request({
        url: '/common/notification/count',
        method: 'get',
    })
}

export function getNotificationPage(data) {
    return request({
        url: '/common/notification/page',
        method: 'post',
        data
    })
}

export function maskNotificationRead(id) {
    return request({
        url: '/common/notification/read?notificationId='+id,
        method: 'put',
    })
}


export function uploadFileChunkInit(data) {
    return request({
        url: '/common/file/upload/chunk/init',
        method: 'post',
        headers: {
            'content-type': 'multipart/form-data'
        },
        data
    })
}

export function uploadChunkFinish(data) {
    return request({
        url: '/common/file/upload/chunk/finish',
        method: 'post',
        headers: {
            'content-type': 'multipart/form-data'
        },
        data
    })
}

export function uploadFileChunk(formData) {
    return request({
        url: '/common/file/upload/chunk',
        headers: {
            'content-type': 'multipart/form-data'
        },
        method: 'post',
        data: formData
    })
}