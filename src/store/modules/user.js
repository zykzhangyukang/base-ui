import {getUserInfo} from "../../api/login";
import {DynamicRoutes} from "../../router";

const state = {
    // 用户信息
    userInfo: null
}

const getters = {}

const mutations = {
    SET_USER_INFO(state, userInfo) {
        state.userInfo = userInfo;
    },
    CLEAR_USER_INFO(state) {
        state.userInfo = null;
    },
}

const actions = {
    async FETCH_USER_INFO({commit, state}) {
        let {result: data} = await getUserInfo();
        commit('SET_USER_INFO', data);
    }
}



export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
