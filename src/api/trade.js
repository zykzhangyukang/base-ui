import request from '../request'

export function getFundListData() {
    return request({
        url: '/trade/fund/list',
        method: 'get'
    })
}
