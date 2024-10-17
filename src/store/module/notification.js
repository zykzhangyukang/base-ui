
const state = {
    fundTips: '暂无基金数据',
}

const getters = {
}

const mutations = {
    SET_FUND_TIPS(state, message){
        state.fundTips = message;
    }
}

const actions = {

}

export default {
    namespaced: true,
    state,
    getters,
    mutations
}
