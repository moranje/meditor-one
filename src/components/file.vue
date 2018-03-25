<template>
  <m1-editor
    language="snippet"
    :value="value"
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
    value() {
      const file = this.$store.getters.findFile('.key', this.$route.params.id);

      if (file && file.value !== undefined) return file.value;

      return '';
    }
  },

  mounted() {
    this.$store.commit('setSaveState', 'saved');
  },

  methods: {
    save(changes) {
      const file = this.$store.getters.findFile('.key', this.$route.params.id);
      const value =
        typeof changes !== 'object' ? changes : changes.doc.getValue();

      if (file) {
        this.$store.dispatch('updateFile', {
          id: file['.key'],
          key: 'value',
          value
        });

        this.$store.commit('setSaveState', 'saved');
      }
    },

    willSave(changes) {
      this.$store.commit('setSaveState', 'unsaved');

      // Cancel saving while typing
      clearTimeout(this.timeOutId);

      this.timeOutId = setTimeout(() => {
        let state = this.$store.getters.getSaveState();
        if (state === 'unsaved') {
          this.save(changes);
        }
      }, 5000);
    }
  }
};
</script>
