import Vue from 'vue'
import Vuex from 'vuex'
import request from './request'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: '',
        user: null,
        defaultRole: ''
    },
    getters: {
        isLogin(state) {
            return state.token != null && state.token !== ''
        }
    },
    mutations: {
        setToken(state, token) {
            request.setAuthorizationValue(token)
            state.token = token
        },
        setUser(state, user) {
            state.user = user
        },
        setDefaultRole(state, defaultRole) {
            state.defaultRole = defaultRole
        }
    },
    actions: {
        login({commit, state}, loginData) {
            commit('setToken', loginData.access_token)
            commit('setUser', loginData.user)
            localStorage.setItem('state', JSON.stringify(state))
        },
        getLocalStorageState({commit, state}) {
            if (state.token !== "" && state.user)
                return state.user;
            const hisState = JSON.parse(localStorage.getItem('state'));
            if (!hisState)
                return null
            commit('setToken', hisState.token)
            commit('setUser', hisState.user)
            commit('setDefaultRole', hisState.defaultRole)
            return hisState.user;
        },
        logout({state}) {
            state.token = ''
            state.user = null
            state.defaultRole = ''
            localStorage.removeItem('state')
        }
    }
})
