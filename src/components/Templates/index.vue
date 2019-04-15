<template lang="html">
  <VLayout
    fill-height
    class="content"
  >
    <VFlex
      class="templates"
      xs3
    >
      <FileList :files="files" />
    </VFlex>

    <VDivider vertical />

    <VFlex
      class="templates"
      xs9
    >
      <RouterView />
    </VFlex>
  </VLayout>
</template>

<script lang="js">
import FileList from '@/components/Templates/FileList'
import File from '@/store/models/File'

export default {
  name: 'Templates',

  metaInfo: {
    title: 'Templates'
  },

  components: {
    FileList
  },

  computed: {
    files () {
      return File
        .query()
        .where('parentId', this.$route.params.folderId)
        .orderBy('name')
        .all()
    }
  },

  mounted () {},

  methods: {

  }
}
</script>

<style scoped lang="scss">
  .templates {
    overflow-y: hidden;
    height: calc(100vh - 64px - 56px);
  }
</style>
