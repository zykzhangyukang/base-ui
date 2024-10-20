
const state = {
    fundData:  []
}

const getters = {
}

const mutations = {
    SET_FUND_DATA(state, message){
        state.fundData = message;
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
