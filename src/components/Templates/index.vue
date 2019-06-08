<template lang="html">
  <VLayout class="content" :style="`height: ${height}px`">
    <VFlex class="templates" xs3>
      <FileList :files="files" />
    </VFlex>

    <VDivider vertical />

    <VFlex class="templates" xs9>
      <RouterView />
    </VFlex>
  </VLayout>
</template>

<script lang="js">
import UI from '@/store/models/UI'
import FileList from '@/components/Templates/FileList'
import File from '@/store/models/File'

export default {
  name: 'Templates',

  metaInfo: {
    title: 'Templates',
  },

  components: {
    FileList,
  },

  computed: {
    viewport() {
      return UI.find('viewport')
    },

    navbar() {
      return UI.find('navbar')
    },

    height () {
      const FOOTER = 56

      if (!this.viewport || !this.navbar) return 0

      return this.viewport.height - this.navbar.height - FOOTER
    },

    files () {
      return File
        .query()
        .where('parentId', this.$route.params.folderId)
        .orderBy('name')
        .all()
    },
  },

  mounted () {},

  methods: {

  },
}
</script>

<style scoped lang="scss">
.templates {
  overflow-y: hidden;
}
</style>
