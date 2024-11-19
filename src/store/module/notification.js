
const state = {
    fundData:  [],
    showDeviceMsg: null,
}

const getters = {
}

const mutations = {
    SET_FUND_DATA(state, message){
        state.fundData = message;
    },
    SET_DEVICE_CHECK(state, message){
        state.showDeviceMsg = message;
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
