<template lang="html">
  <VLayout :style="`height: ${height}px`" class="content">
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
    height () {
      if (this.$store.getters.main) return this.$store.getters.main.height

      return 0
    },

    files () {
      return File
        .query()
        .where('parentId', this.$route.params.folderId)
        .orderBy('name')
        .all()
    },
  },
}
</script>

<style scoped lang="scss">
.templates {
  overflow-y: hidden;
}
</style>
