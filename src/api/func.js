import request from '../request'

export function getFuncTree() {
    return request({
        url: '/auth/func/tree',
        method: 'get',
    })
}

export function getFuncPage(data) {
    return request({
        url: '/auth/func/page',
        method: 'post',
        data
    })
}
