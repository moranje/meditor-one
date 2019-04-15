import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import User from './mixins/User'
import router from './router'
import store from './store'
import VueWait from '@/plugins/vue-wait'
import '@/plugins/resize'
import './registerServiceWorker'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false

Vue.mixin(User)

new Vue({
  router,
  store,
  // @ts-ignore
  wait: new VueWait({
    useVuex: true
  }),
  render: h => h(App)
}).$mount('#app')
