import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        selectedArcs: ''
    },
    mutations: {
      change(state, selectedArcs) {
        state.selectedArcs = selectedArcs
      }
    },
    getters: {
      selectedArcs: state => state.selectedArcs
    }
})