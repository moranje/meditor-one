<template lang="html">
  <VLayout
    class="status"
  >
    <VFlex xs12>
      <Editor
        :value="value"
        language="status"
        :visible="true"
        @blur="update"
        @change="update"
      />
    </VFlex>
  </VLayout>
</template>

<script>
import Editor from "@/components/shared/Editor";

export default {
  name: 'Status',

  metaInfo: {
    title: 'Status',
  },

  components: {
    Editor
  },

  computed: {
    value() {
      return 'Test';
    }
  },

  methods: {
    update(value) {
      console.log(value);
    }
  }
}
</script>

<style scoped lang="scss">
  .status {
    overflow-y: hidden;
    height: calc(100vh - 64px - 56px);
  }
</style>
