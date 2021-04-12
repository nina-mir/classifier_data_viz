import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        selectedArcs: '',
        num_data_files: 0, 
        name_data_files:[],
        op_type:''
    },
    mutations: {
      change(state, selectedArcs) {
        state.selectedArcs = selectedArcs
      }, 
      change_num_df(state, num_data_files){
        state.num_data_files = num_data_files;
      },
      chage_op_type(state, op_type){
        state.op_type = op_type;
      }
    },
    getters: {
      selectedArcs: state => state.selectedArcs,
      num_data_files: state => state.num_data_files, 
      name_data_files: state => state.name_data_files
    }
})