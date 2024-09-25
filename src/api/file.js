import request from '../request'

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