<template>
  <section class="code-block">
    <div class="code-block-header">{{ title.toUpperCase() }}</div>
    <Editor :value="md" :language="`doc-${type}`" lines-as-height visible />
    <div class="code-block-footer"></div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import Editor from '@/components/Shared/Editor'

export default Vue.extend({
  name: 'CodeBlock',

  components: {
    Editor,
  },

  props: {
    title: {
      type: String,
      default: '',
    },

    type: {
      type: String,
      default: 'snippet',
    },

    md: {
      type: String,
      default: '',
    },
  },

  data: () => ({}),

  methods: {},
})
</script>

<style scoped lang="scss">
.code-block {
  background-color: #f5f5f5;
  border-radius: 2px;

  .code-block-header {
    padding: 10px 25px;
    font-size: 12px;
    color: grey;
    line-height: 20px;
  }

  .code-block-footer {
    margin-bottom: 20px;
    padding: 10px;
  }
}
</style>
