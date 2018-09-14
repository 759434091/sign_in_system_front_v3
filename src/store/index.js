import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ajaxConfig: {},
    user: {},
    week: '',
    expire: null
  },
  mutations: {
    login (state, data) {
      state.expire = data.expire
      state.user = data.user
      state.ajaxConfig = {
        headers: {
          'Access-Token': data.token.toString()
        }
      }
    },
    updateWeek (state, week) {
      state.week = week
    },
    updateAjaxConfig (state, ajaxConfig) {
      state.ajaxConfig = ajaxConfig
    },
    logout (state) {
      state.ajaxConfig = {}
      state.user = {}
      state.week = ''
    }
  }
})
