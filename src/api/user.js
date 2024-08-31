import request from '../request'

export function getUserPage(data) {
    return request({
        url: '/auth/user/page',
        method: 'post',
        data
    })
}
