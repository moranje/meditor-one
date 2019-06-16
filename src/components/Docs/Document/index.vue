<template>
  <Markdown :value="value" class="markdown-body" />
</template>

<script lang="ts">
import Vue from 'vue'
import Markdown from '../Markdown/index.vue'

export default Vue.extend({
  name: 'Document',

  components: {
    Markdown,
  },

  data: () => ({
    value: '',
  }),

  async created() {
    let value = await import(`raw-loader!./${this.$route.params.docFile}.md`)
    this.value = value.default
  },
})
</script>

<style lang="scss">
.document pre code {
  &:before {
    content: none;
  }

  box-shadow: none;
}
</style>
