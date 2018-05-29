<template>
  <v-toolbar
    color="primary"
    height="64px"
    dark
  >
    <v-toolbar-title
      style="width: 300px"
      class="ml-0 pl-3"
    >
      <span>Meditor One</span>
    </v-toolbar-title>
    <!-- <v-text-field
      flat
      solo-inverted
      prepend-icon="search"
      label="Search"
      class="hidden-sm-and-down"
    /> -->
    <v-spacer/>
    <m1-nav-bar-menu/>
  </v-toolbar>
</template>

<script>
import M1NavBarMenu from './nav-bar-menu';

export default {
  components: {
    M1NavBarMenu
  }
};
</script>

<style lang="scss" scoped>
nav.toolbar.primary {
  z-index: 1;
}

@media print {
  .toolbar {
    display: none;
  }
}
</style>
