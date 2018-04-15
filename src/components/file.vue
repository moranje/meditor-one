<template>
  <m1-monaco
    :value="value"
    language="snippet"
    @before-leave="save"
    @change="willSave"
  />
</template>

<script>
import M1Monaco from './editor/monaco';

export default {
  components: {
    M1Monaco
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

  beforeUpdate() {
    // Cancel saving when changing pages
    clearTimeout(this.timeOutId);
  },

  beforeDestroy() {
    // Cancel saving when changing pages
    clearTimeout(this.timeOutId);
  },

  methods: {
    save(changes, route) {
      if (route && this.$route.fullPath !== route) return;

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
        const state = this.$store.getters.getSaveState();
        if (state === 'unsaved') {
          this.save(changes, this.$route.fullPath);
        }
      }, 5000);
    }
  }
};
</script>
