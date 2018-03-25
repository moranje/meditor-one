<template>
  <m1-editor
    :value="document.value"
    language="status"
    @before-leave="save"
    @change="willSave"
  />
</template>

<script>
import M1Editor from './editor/editor';

export default {
  components: {
    M1Editor
  },

  data() {
    return {
      timeOutId: null
    };
  },

  computed: {
    document() {
      return this.$store.getters.findDocument(0);
    }
  },

  created() {
    this.$store.commit('createDocument', {
      value: ''
    });
  },

  mounted() {
    this.$store.commit('setSaveState', 'local');
  },

  methods: {
    save(changes) {
      this.$store.commit('updateDocument', {
        id: 0,
        key: 'value',
        value: changes
      });
      this.$store.commit('setSaveState', 'local');
    },

    willSave(changes) {
      this.$store.commit('setSaveState', 'unsaved');

      // Cancel saving while typing
      clearTimeout(this.timeOutId);

      this.timeOutId = setTimeout(() => {
        const state = this.$store.getters.getSaveState();
        if (state === 'unsaved') {
          this.save(changes);
        }
      }, 5000);
    }
  }
};
</script>
