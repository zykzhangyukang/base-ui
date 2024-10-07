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

export function updatePlan(data) {
    return request({
        url: '/sync/plan/update',
        method: 'put',
        data
    })
}

export function deletePlan(uuid) {
    return request({
        url: '/sync/plan/delete?uuid='+uuid,
        method: 'delete',
    })
}

export function refreshPlan() {
    return request({
        url: '/sync/plan/refresh',
        method: 'put',
    })
}


export function updatePlanStatus(data) {
    return request({
        url: '/sync/plan/update/status',
        method: 'put',
        data
    })
}


export function getPlanContent(uuid) {
    return request({
        url: '/sync/plan/detail?uuid='+uuid,
        method: 'get',
    })
}
