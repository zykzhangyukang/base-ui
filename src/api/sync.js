import request from "@/request";

export function getPlanPage(data) {
    return request({
        url: '/sync/plan/page',
        method: 'post',
        data
    })
}

export function savePlan(data) {
    return request({
        url: '/sync/plan/save',
        method: 'post',
        data
    })
}
