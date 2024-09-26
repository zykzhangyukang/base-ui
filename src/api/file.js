import request from '../request'

export function uploadFileChunkStart(data) {
    return request({
        url: '/auth/file/upload/chunk/start',
        method: 'post',
        headers: {
            'content-type': 'multipart/form-data'
        },
        data
    })
}

export function uploadFileChunk(formData) {
    return request({
        url: '/auth/file/upload/chunk',
        headers: {
            'content-type': 'multipart/form-data'
        },
        method: 'post',
        data: formData
    })
}