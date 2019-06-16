<template lang="html">
  <VToolbar ref="navbar" app fixed color="primary" dark>
    <VToolbarTitle v-show="fileName">
      {{ fileName }}
    </VToolbarTitle>

    <VSpacer />

    <VBtn v-show="$route.params.folderId" @click="add" icon>
      <VIcon>
        mdi-file-plus
      </VIcon>
    </VBtn>

    <!-- Dropdown should contain links to account (practice info), docs and login/out -->

    <VMenu offset-y nudge-bottom="14">
      <template v-slot:activator="{ on }">
        <VBtn v-on="on" dark icon>
          <VIcon :color="loginColor">
            mdi-account-circle-outline
          </VIcon>
        </VBtn>
      </template>

      <VList>
        <VListTile to="/account" avatar>
          <VListTileAction>
            <VIcon>
              mdi-account-circle-outline
            </VIcon>
          </VListTileAction>

          <VListTileContent>
            <VListTileTitle>Account</VListTileTitle>
          </VListTileContent>
        </VListTile>
        <VListTile to="/docs" avatar>
          <VListTileAction>
            <VIcon>
              mdi-book-open-outline
            </VIcon>
          </VListTileAction>

          <VListTileContent>
            <VListTileTitle>Docs</VListTileTitle>
          </VListTileContent>
        </VListTile>
        <VListTile v-if="!$user" to="/login" avatar>
          <VListTileAction>
            <VIcon>
              mdi-login
            </VIcon>
          </VListTileAction>

          <VListTileContent>
            <VListTileTitle>Login</VListTileTitle>
          </VListTileContent>
        </VListTile>
        <VListTile v-if="$user" @click="logout" avatar>
          <VListTileAction>
            <VIcon>
              mdi-logout
            </VIcon>
          </VListTileAction>

          <VListTileContent>
            <VListTileTitle>Logout</VListTileTitle>
          </VListTileContent>
        </VListTile>
      </VList>
    </VMenu>

    <ResizeObserver @notify="didResize" />
  </VToolbar>
</template>

<script lang="js">
import User from '@/store/models/User'
import File from '@/store/models/File'
import Folder from '@/store/models/Folder'
import Editor from '@/store/models/Editor'
import UI from '@/store/models/UI'
import { db, firebase } from '@/plugins/firebase'

export default {
  name: 'NavBar',

  computed: {
    loginColor () {
      if (this.$user) return 'success'

      return 'error'
    },

    fileName() {
      if (this.$route.params.fileId) {
        let file = File.find(this.$route.params.fileId)

        if (file) return file.name
      }

      return null
    },
  },

  mounted() {
    this.didResize()
  },

  methods: {
    navigate () {
      this.$router.push('status')
    },

    didResize() {
      this.$store.commit('addElement', {
        element: this.$refs.navbar.$el,
        position: 'top',
        index: 0,
      })
    },

    add () {
      let ref = db.collection(`owner/files/${this.$user.uid}`).doc()
      let parent = Folder.find(this.$route.params.folderId)

      File.insert({
        data: {
          id: ref.id,
          name: '',
          value: '',
          ownerId: this.$user.uid,
          parentId: parent.id,
        },
      })

      // Add relationship data to parent. Also uncollapse parent to edit child.
      Folder.update({
        where: parent.id,
        data: {
          fileIds: [ref.id, ...parent.fileIds],
        },
      })
    },

    logout () {
      firebase
        .auth()
        .signOut()
        .then(() => {
          User.deleteAll()
          // This is able to delete all records appearently
          // File.deleteAll();
          // Folder.deleteAll();
        })
        .catch((error) => {
          // An error happened.
          throw error
        })
    },
  },
}
</script>

<style scoped lang="scss">
.nav-bar {
}
</style>
