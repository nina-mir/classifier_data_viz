import Vue from 'vue'
import App from './App.vue'
import { store } from './store/store'
import Vuetify from 'vuetify'
// import 'vuetify / dist / vuetify.min.css'

Vue.use(Vuetify)




Vue.config.productionTip = false

new Vue({
  vuetify: new Vuetify(),
  render: h => h(App),
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
}).$mount('#app')
