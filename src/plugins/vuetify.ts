import Vue from 'vue'
// @ts-ignore
import Vuetify from 'vuetify/lib'
import 'vuetify/dist/vuetify.min.css'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import nl from 'vuetify/src/locale/nl'
// @ts-ignore
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  theme: {
    primary: colors.blue.darken3,
    secondary: colors.cyan.lighten1,
    accent: colors.green.lighten1,
    error: colors.red.lighten1,
    warning: colors.amber.lighten1,
    info: colors.cyan.lighten1,
    success: colors.green.lighten1,
    light: colors.grey.lighten2,
    dark: colors.grey.darken3,
  },
  customProperties: true,
  iconfont: 'mdi',
  lang: {
    locales: { nl },
    current: 'nl',
  },
})
