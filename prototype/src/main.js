import Vue from 'vue'
import App from './App.vue'
import { store } from './store/store'
import PrettyCheckbox from 'pretty-checkbox-vue';

 
Vue.use(PrettyCheckbox);


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
}).$mount('#app')
