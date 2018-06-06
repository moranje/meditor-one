import Vue from 'vue';
import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  transitions
} from 'vuetify';
import colors from 'vuetify/es5/util/colors';
import '../node_modules/vuetify/src/stylus/app.styl';

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    transitions
  },
  theme: {
    primary: colors.blue.darken3,
    secondary: colors.cyan.lighten1,
    accent: colors.green.lighten1,
    error: colors.red.lighten1,
    warning: colors.amber.lighten1,
    info: colors.cyan.lighten1,
    success: colors.green.lighten1,
    light: colors.grey.lighten2,
    dark: colors.grey.darken3
  }
});
