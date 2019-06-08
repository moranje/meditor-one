<template lang="html">
  <VLayout class="status">
    <VFlex xs12>
      <Editor
        uid="status"
        :value="value"
        :visible="true"
        language="status"
        @blur="update"
        @change="update"
      />
    </VFlex>
  </VLayout>
</template>

<script>
import EditorComponent from '@/components/Shared/Editor'
import Editor from '@/store/models/Editor'

export default {
  name: 'Status',

  metaInfo: {
    title: 'Status',
  },

  components: {
    Editor: EditorComponent,
  },

  computed: {
    value() {
      let status = Editor.find('status')

      if (status && status.instance) return status.instance.getValue()

      return ''
    },
  },

  methods: {
    update(value) {
      // console.log('UPDATE STATUS', value);
    },
  },
}
</script>

<style scoped lang="scss">
.status {
  overflow-y: hidden;
}
</style>
