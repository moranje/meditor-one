<template lang="html">
  <VNavigationDrawer
    ref="sidenav"
    v-model="drawer"
    :mini-variant="isMini"
    @update:mini-variant="didResize"
    fixed
    stateless
    app
    class="side-nav"
  >
    <VToolbar flat class="transparent">
      <VAvatar tile>
        <BaseIcon icon-color="rgba(0,0,0,0.54)" height="36" width="48" />
      </VAvatar>

      <VSpacer />
      <VBtn v-show="!isMini" @click.stop="isMini = true" icon>
        <VIcon>mdi-chevron-left</VIcon>
      </VBtn>
    </VToolbar>
    <VList>
      <VListTile to="/status">
        <VListTileAction>
          <VIcon>mdi-clipboard-text-outline</VIcon>
        </VListTileAction>
        <VListTileContent>
          <VListTileTitle>STATUS</VListTileTitle>
        </VListTileContent>
      </VListTile>
      <VListTile to="/docs">
        <VListTileAction>
          <VIcon>mdi-book-open-outline</VIcon>
        </VListTileAction>
        <VListTileContent>
          <VListTileTitle>DOCS</VListTileTitle>
        </VListTileContent>
      </VListTile>
      <VDivider />
      <VListTile :inactive="!isMini" @click="navigate">
        <VListTileAction v-show="isMini">
          <VIcon>mdi-folder-multiple</VIcon>
        </VListTileAction>
        <VListTileContent>
          <VListTileTitle>TEMPLATES</VListTileTitle>
        </VListTileContent>
        <VListTileAction>
          <VBtn @click="addFolder" icon ripple>
            <VIcon color="grey lighten-1">
              mdi-plus
            </VIcon>
          </VBtn>
        </VListTileAction>
      </VListTile>
    </VList>
    <FolderList v-show="!isMini" :items="folders" :collapsed="collapsed" />

    <ResizeObserver @notify="didResize" />
  </VNavigationDrawer>
</template>

<script lang="js">
// import FolderList from '@/components/SideNav/FolderList'
import User from '@/store/models/User'
import Folder from '@/store/models/Folder'
import Editor from '@/store/models/Editor'

import { db } from '@/plugins/firebase'
import BaseIcon from '@/components/Shared/BaseIcon'

// Lazily loaded component
const FolderList = () => import('@/components/SideNav/FolderList')

export default {
  name: 'SideNav',

  components: {
    FolderList,
    BaseIcon,
  },

  data: () => ({
    isMini: true,
    drawer: false,
  }),

  computed: {
    folders () {
      return Folder
        .query()
        .where('parentId', null)
        .withAllRecursive()
        .orderBy('name')
        .all()
    },

    collapsed () {
      return Folder.all()
        .filter(folder => folder.collapsed === false)
        .map(folder => folder.id)
    },
  },

  watch: {
    '$vuetify.breakpoint.mdAndUp': function(isMdAndUp) {
      this.drawer = isMdAndUp

      if (isMdAndUp) {
        this.didResize()
      } else {
        this.$store.commit('removeElement', {
          position: 'left',
          index: 0,
        })
      }
    },
  },

  created() {
    this.drawer = this.$vuetify.breakpoint.mdAndUp
  },

  mounted () {
    this.didResize()
  },

  destroy () {
    this.$store.commit('removeElement', {
      position: 'left',
      index: 0,
    })
  },

  methods: {
    navigate () {
      // Expand navigation drawer
      this.isMini = false

      // this.$router.push('/templates')
    },

    addFolder () {
      const ref = db.collection(`owner/folders/${this.$user.uid}`).doc()

      Folder.insert({
        data: { id: ref.id, name: '', ownerId: this.$user.uid },
      })
    },

    didResize () {
      // FIXME: when the breakpoint kicks in
      if (this.$refs.sidenav && this.$vuetify.breakpoint.mdAndUp) {
        this.$store.commit('addElement', {
          element: this.$refs.sidenav.$el,
          position: 'left',
          index: 0,
        })
      }
    },
  },
}
</script>

<style scoped lang="scss">
.side-nav .v-list {
  padding-bottom: 0;
}

.m1-logo {
  width: 36px;
  height: 36px;
}
</style>
