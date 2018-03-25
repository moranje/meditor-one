<template>
  <v-app id="app">
    <m1-nav-bar/>
    <multipane
      class="sandwich"
      @paneResize="resize"
    >
      <m1-side-bar/>
      <multipane-resizer/>
      <main class="content">
        <router-view/>
      </main>
    </multipane>
    <m1-footer/>
  </v-app>
</template>

<script>
import Vue from 'vue';
import Vuetify from 'vuetify';
import firebase from 'firebase';
import colors from 'vuetify/es5/util/colors';
import { Multipane, MultipaneResizer } from 'vue-multipane';
import { clamp } from 'lodash';

// require styles
import 'vuetify/dist/vuetify.min.css';

import { dbFoldersRef, dbFilesRef } from './firebase-config';
import M1NavBar from './components/nav-bar/nav-bar';
import M1SideBar from './components/side-bar/side-bar';
import M1Footer from './components/footer/footer';

// explicit installation required in module environments
Vue.use(Vuetify, {
  theme: {
    primary: colors.blue.darken3,
    secondary: colors.cyan.lighten1,
    accent: colors.green.lighten1,
    error: colors.red.lighten1,
    warning: colors.amber.lighten1,
    info: colors.cyan.lighten1,
    success: colors.green.lighten1
  }
});

export default {
  components: {
    M1NavBar,
    M1SideBar,
    M1Footer,
    Multipane,
    MultipaneResizer
  },

  computed: {
    user() {
      return this.$store.getters.getUser;
    }
  },

  created() {
    this.$store.dispatch('syncFolders', dbFoldersRef);
    this.$store.dispatch('syncFiles', dbFilesRef);

    firebase.auth().onAuthStateChanged(user => {
      // console.log('Auth', user, arguments);
      if (user) {
        const { displayName, email, uid } = user;
        this.$store.commit('signIn', { displayName, email, uid });
      } else {
        // throw new Error('Immediate sign out error');
        this.$store.commit('signOut');
      }
    });
  },

  methods: {
    resize(pane, container, sidebarSize) {
      const handleWidth = 10;
      const viewportWidth = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      );
      const sidebarWidth = clamp(+sidebarSize.replace('px', ''), 250, 400);

      this.$store.commit('setContentAreaSize', {
        width: viewportWidth - (sidebarWidth + handleWidth)
      });
      this.$store.commit('setSidebarWidth', sidebarWidth);
    }
  }
};
</script>

<style lang="scss" scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  .sandwich {
    flex: 1 0 auto;
    display: flex;
    height: calc(100vh - 64px - 36px);

    .content {
      flex: 1 0 auto;
    }
  }
}

.multipane.sandwich.layout-v .multipane-resizer {
  margin: 0;
  top: 0; /* reset default styling */
  left: 0;
  height: 100%;
  background: rgba(0, 0, 0, 0.12);
}

.application {
  background-color: white;

  .container {
    padding: 0;
  }
}
</style>
