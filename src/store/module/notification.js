import MessageOnce from "@/utils/toast/messageonce";
const messageOnce = new MessageOnce()

const state = {
    fundData:  []
}

const getters = {
}

const mutations = {
    SET_FUND_DATA(state, message){
        state.fundData = message;
    },
    SET_DEVICE_CHECK(state, message){
        messageOnce.warning(message);
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
