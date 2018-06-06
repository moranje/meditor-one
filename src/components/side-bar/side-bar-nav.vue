<template>
  <v-toolbar
    flat
    color="white"
  >
    <v-toolbar-title class="grey--text text--darken-2">FILES</v-toolbar-title>
    <v-spacer/>
    <v-btn
      v-if="isEmpty"
      icon
      @click="newFolder"
    >
      <v-icon color="grey darken-2">mdi-folder-plus</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
export default {
  computed: {
    isEmpty() {
      const root = this.$store.getters.findFolder('isRoot', true);

      if (root && root.isRoot) {
        return false;
      }

      return true;
    }
  },

  methods: {
    newFolder() {
      this.$store.dispatch('createFolder', {
        folder: {
          name: '',
          isRoot: true,
          collapsed: false,
          editable: true,
          type: 'folder'
        },
        id: null
      });
    }
  }
};
</script>

<style lang="scss">
@import '../../assets/variables';

// .btn--active .btn__content:before {
//   background-color: $accent;
// }
</style>
