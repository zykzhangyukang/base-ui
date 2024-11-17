import store from "@/store";


export const adminDomain = "admin";


/**
 * 格式化显示常量信息
 * @param group
 * @param domain
 * @returns {*|*[]}
 */
export function getConst(group,domain=adminDomain) {
    if (!group) {
        return [];
    }
    if(!store.state.permission.const[domain]){
        return [];
    }
    const arr = store.state.permission.const[domain].filter(e => e.group === group);
    if (arr.length) {
        return arr[0].itemList;
    }
    return [];
}


/**
 * 格式化常量
 * @param list
 * @returns {{}}
 */
export function formatConst(list) {
    const obj = {};
    list.forEach((ele) => {
        obj[ele.code] = ele.name;
    })
    return obj;
}
