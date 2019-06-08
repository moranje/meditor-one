<template lang="html">
  <VNavigationDrawer
    v-if="$vuetify.breakpoint.mdAndUp"
    ref="sidenav"
    v-model="drawer"
    :mini-variant="isMini"
    fixed
    stateless
    app
    class="side-nav"
    @update:mini-variant="handleResize"
  >
    <VToolbar flat class="transparent">
      <VAvatar tile>
        <BaseIcon icon-color="rgba(0,0,0,0.54)" height="36" width="36" />
      </VAvatar>

      <VSpacer />
      <VBtn v-show="!isMini" icon @click.stop="isMini = true">
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
          <VBtn icon ripple @click="addFolder">
            <VIcon color="grey lighten-1">
              mdi-plus
            </VIcon>
          </VBtn>
        </VListTileAction>
      </VListTile>
    </VList>
    <FolderList v-show="!isMini" :items="folders" :collapsed="collapsed" />

    <ResizeObserver @notify="handleResize" />
  </VNavigationDrawer>
</template>

<script lang="js">
// import FolderList from '@/components/SideNav/FolderList'
import User from '@/store/models/User'
import Folder from '@/store/models/Folder'
import Editor from '@/store/models/Editor'
import UI from '@/store/models/UI'

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
    drawer: {},
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

  mounted () {
    this.handleResize()
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

    handleResize () {
      UI.insertOrUpdate({
        data: [
          {
            id: 'viewport',
            width: Math.max(
              document.documentElement.clientWidth,
              window.innerWidth || 0
            ),
            height: Math.max(
              document.documentElement.clientHeight,
              window.innerHeight || 0
            ),
          },
          {
            id: 'sidenav',
            width: this.$refs.sidenav.$el.clientWidth,
            height: this.$refs.sidenav.$el.clientHeight,
          },
        ],
      })
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
