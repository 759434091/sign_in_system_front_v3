import Vue from 'vue'
import Vuex from 'vuex'
import request from './request'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: "",
        user: null
    },
    getters: {
        getAuthorizationValue(state) {
            return `Bearer ${state.token}`
        }
    },
    mutations: {
        setToken(state, token) {
            request.setAuthorizationValue(token)
            state.token = token
        },
        setUser(state, user) {
            state.user = user
        }
    },
    actions: {}
})
