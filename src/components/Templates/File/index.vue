<template lang="html">
  <Editor
    uid="snippet"
    :value="value"
    language="snippet"
    :visible="visible"
    @blur="update"
    @change="update"
  />
</template>

<script lang="js">
import Editor from '@/components/Shared/Editor'
import File from '@/store/models/File'

export default {
  name: 'File',

  components: {
    Editor,
  },

  computed: {
    value () {
      let file = File.find(this.$route.params.fileId)

      if (file && file.value) return file.value

      return ''
    },

    visible () {
      return !this.$wait.waiting('user records')
    },
  },

  methods: {
    update (value) {
      File.update({
        id: this.$route.params.fileId,
        value,
      })
    },
  },
}
</script>

<style scoped lang="scss">
.file {
}
</style>
