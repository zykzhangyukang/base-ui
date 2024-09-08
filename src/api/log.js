import request from "@/request";

export function getLogPage(data) {
    return request({
        url: '/auth/log/page',
        method: 'post',
        data
    })
}
