
const state = {
    fundData:  []
}

const getters = {
}

const mutations = {
    SET_FUND_DATA(state, message){
        console.log(message)
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
