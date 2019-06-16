<template>
  <VApp>
    <SideNav />

    <NavBar ref="navbar" />

    <VContent>
      <RouterView :key="$route.fullPath" />
    </VContent>

    <Footer />

    <ResizeObserver @notify="didResize" />
  </VApp>
</template>

<script>
import { firebase } from '@/plugins/firebase'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

import User from '@/store/models/User'

import SideNav from '@/components/SideNav'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export default {
  name: 'App',

  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: 'Meditor One',
    // all titles will be injected into this template
    titleTemplate: '%s',
  },

  components: {
    SideNav,
    NavBar,
    Footer,
  },

  created() {
    this.$wait.start('user records')

    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        // First add user since it is needed for fetch calls
        await User.create({ data: user })

        // Preloads all
        await this.$store.dispatch('entities/folders/fetchAll')
        await this.$store.dispatch('entities/files/fetchAll')

        this.$wait.end('user records')
      } else {
        // throw new Error('Immediate sign out error');
        User.deleteAll()
      }
    })
  },

  mounted() {
    this.didResize()
  },

  methods: {
    didResize() {
      this.$store.commit('addDocument', {
        width: Math.max(
          document.documentElement.clientWidth,
          window.innerWidth || 0
        ),
        height: Math.max(
          document.documentElement.clientHeight,
          window.innerHeight || 0
        ),
      })
    },
  },
}
</script>
