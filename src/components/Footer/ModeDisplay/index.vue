<template>
  <section v-if="mode">
    <div class="mode-display">
      {{ mode }}
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import Editor from '@/store/models/Editor'

export default Vue.extend({
  name: 'ModeDisplay',

  props: {},

  data: () => ({}),

  computed: {
    editor() {
      return Editor.find('status')
    },

    mode() {
      if (this.$route && this.$route.name !== 'status') return

      return `${this.editor.snippetMode ? 'Snippet' : 'Text'} mode`
    },
  },

  methods: {},
})
</script>

<style scoped lang="scss">
.mode-display {
}
</style>
