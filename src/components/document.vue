<template>
  <m1-monaco
    :value="document.value"
    language="status"
    theme="statusTheme"
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
    document() {
      return this.$store.getters.findDocument(0);
    }
  },

  created() {
    if (!this.document || this.document.value === undefined) {
      this.$store.commit('createDocument', {
        value: ''
      });
    }
  },

  mounted() {
    this.$store.commit('setSaveState', 'local');
  },

  beforeDestroy() {
    // Cancel saving when changing pages
    clearTimeout(this.timeOutId);
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
