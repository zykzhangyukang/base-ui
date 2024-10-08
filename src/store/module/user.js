import {getUserInfo, login, switchUserLogin} from "../../api/auth.js";
import {
    getRefreshToken,
    removeAccessToken,
    removeExpiresIn,
    removeRefreshToken,
    setAccessToken,
    setExpiresIn,
    setRefreshToken,
} from "@/utils/cookie";
import axios from 'axios';

const state = {
    userInfo: null,
}

const getters = {}

const mutations = {
    SET_USER_INFO(state, userInfo) {
        state.userInfo = userInfo;
    },
    SET_TOKEN(state, result) {
        // 设置令牌
        setAccessToken(result.accessToken)
        setRefreshToken(result.refreshToken)

        // 设置令牌过期时间
        const current = new Date()
        const expireTime = current.setTime(current.getTime() + 1000 * result.expiresIn);
        setExpiresIn(expireTime)
    },
    REMOVE_TOKEN() {
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
            axios.get(process.env.VUE_APP_BASE_API + '/auth/user/refresh/token', {
                params: {
                    refreshToken: getRefreshToken()
                }
            }).then(response => {
                const {result} = response.data;
                commit('SET_TOKEN', result);
                resolve(result.accessToken);
            }).catch(error => {
                reject(error);
            });
        });
    },
    async SWITCH_USER_LOGIN({commit, state}, username){
        return new Promise((resolve, reject) => {
            switchUserLogin({username: username.trim()}).then(response => {
                commit('SET_TOKEN', response.result);
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    }
}


export default {
    namespaced: true, state, getters, mutations, actions
}
