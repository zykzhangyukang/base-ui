import request from '../request'

export function getUserDeptList() {
    return request({
        url: '/auth/dept/list',
        method: 'get',
    })
}
