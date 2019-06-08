import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'
import App from './App.vue'
import './plugins/vuetify'
import User from './mixins/User'
import router from './router'
import store from './store'
import VueWait from '@/plugins/vue-wait'
import '@/plugins/resize'
import './registerServiceWorker'

Sentry.init({
  dsn: 'https://f97be4a8674345e8881c47bd304c59d4@sentry.io/1454586',
  integrations: [
    new Integrations.Vue({
      Vue,
      attachProps: true,
    }),
  ],
})

Vue.config.productionTip = false

Vue.mixin(User)

new Vue({
  router,
  store,
  // @ts-ignore
  wait: new VueWait({
    useVuex: true,
  }),
  render: h => h(App),
}).$mount('#app')
