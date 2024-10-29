import request from '../request'

export function getFundListData(data) {
    return request({
        url: '/trade/fund/list',
        method: 'get'
    })
}
