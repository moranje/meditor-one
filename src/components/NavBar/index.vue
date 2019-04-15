<template lang="html">
  <VToolbar
    ref="navbar"
    app
    fixed
    color="primary"
    dark
  >
    <BaseIcon
      icon-color="#eee"
      height="36"
      width="36"
      class="hidden-lg-and-up"
      @click="navigate"
    />

    <VSpacer />

    <VBtn
      v-show="$route.params.folderId"
      icon
      @click="add"
    >
      <VIcon>
        mdi-file-plus
      </VIcon>
    </VBtn>

    <VBtn
      icon
      to="/login"
    >
      <VIcon :color="loginColor">
        mdi-account-circle-outline
      </VIcon>
    </VBtn>
    <resize-observer @notify="handleResize" />
  </VToolbar>
</template>

<script lang="js">
import BaseIcon from '@/components/Shared/BaseIcon'
import File from '@/store/models/File'
import Folder from '@/store/models/Folder'
import Editor from '@/store/models/Editor'
import { db } from '@/plugins/firebase'

export default {
  name: 'NavBar',

  components: {
    BaseIcon
  },

  computed: {
    loginColor () {
      if (this.$user) return 'success'

      return 'error'
    }
  },

  mounted () {
    Editor.insertOrUpdate({
      data: [
        Object.assign({ id: 'snippet' }, this.getSize()),
        Object.assign({ id: 'status' }, this.getSize())
      ]
    })
  },

  methods: {
    navigate () {
      this.$router.push('status')
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
          parentId: parent.id
        }
      })

      // Add relationship data to parent. Also uncollapse parent to edit child.
      Folder.update({
        where: parent.id,
        data: {
          fileIds: [ref.id, ...parent.fileIds]
        }
      })
    },

    handleResize () {
      Editor.insertOrUpdate({
        data: [
          Object.assign({ id: 'snippet' }, this.getSize()),
          Object.assign({ id: 'status' }, this.getSize())
        ]
      })
    },

    getSize () {
      return {
        navbar: {
          width: this.$el.clientWidth,
          height: this.$el.clientHeight
        },
        viewport: {
          width: Math.max(
            document.documentElement.clientWidth,
            window.innerWidth || 0
          ),
          height: Math.max(
            document.documentElement.clientHeight,
            window.innerHeight || 0
          )
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .nav-bar {

  }
</style>
