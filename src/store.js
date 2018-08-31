import Vue from 'vue'
import Vuex from 'vuex'
import request from './request'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: '',
        user: null,
        defaultRole: '',
        week: 0,
        dayMap: new Map([[1, '一'], [2, '二'], [3, '三'], [4, '四'], [5, '五'], [6, '六'], [7, '日']])
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
        },
        setWeek(state, week) {
            state.week = week
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
            commit('setWeek', hisState.week)
            return hisState.user;
        },
        logout({state}) {
            state.token = ''
            state.user = null
            state.defaultRole = ''
            state.week = 0
            localStorage.removeItem('state')
        }
    }
})
