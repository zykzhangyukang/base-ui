import {getUserInfo, login} from "../../api/login";
import {
    getRefreshToken,
    removeAccessToken,
    removeExpiresIn,
    removeRefreshToken,
    setAccessToken,
    setExpiresIn,
    setRefreshToken
} from "../../utils/cookie";
import axios from 'axios';

const state = {
    // 用户信息
    userInfo: null,
}

const getters = {}

const mutations = {
    SET_USER_INFO(state, userInfo) {
        state.userInfo = userInfo;
    },
    CLEAR_USER_INFO(state) {
        state.userInfo = null;
    },
    SET_TOKEN(state, result){
        setAccessToken(result.accessToken)
        setRefreshToken(result.refreshToken)

        // 设置令牌过期时间
        const current = new Date()
        const expireTime = current.setTime(current.getTime() + 1000 * result.expiresIn);
        setExpiresIn(expireTime)
    },
    REMOVE_TOKEN(){
        removeRefreshToken();
        removeAccessToken();
        removeExpiresIn();
    }
}

const actions = {
    async FETCH_USER_INFO({commit, state}) {
        let {result: data} = await getUserInfo();
        commit('SET_USER_INFO', data);
    },
    async LOGIN({commit, state}, userInfo) {
        const {username, password} = userInfo;
        return new Promise((resolve, reject) => {
            login({username: username.trim(), password: password}).then(response => {
                const {result} = response
                commit('SET_TOKEN', result);
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    async REFRESH_TOKEN({commit}) {
        return new Promise((resolve, reject) => {
            axios.get(process.env.VUE_APP_BASE_API +'/auth/user/refresh/token', {
                params: {
                    refreshToken: getRefreshToken()
                }
            }).then(response => {
                const {result} = response
                commit('SET_TOKEN', result);
                resolve(response.data.accessToken);
            }).catch(error => {
                reject(error);
            });
        });
    }
}


export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
