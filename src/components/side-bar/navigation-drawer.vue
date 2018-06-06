<template>
  <v-navigation-drawer
    dark
    mini-variant
    stateless
    value="true"
    class="navigation-drawer"
  >
    <v-toolbar
      flat
      class="transparent"/>
    <v-list
      class="pt-0"
      dense>
      <v-list-tile :to="{ name: 'document'}">
        <v-list-tile-action>
          <v-icon color="grey lighten-5">fas fa-file-medical-alt</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Status files</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile>
        <v-list-tile-action>
          <v-icon color="grey lighten-5">fas fa-file-code</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Snippets</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import '../../assets/variables';

.navigation-drawer {
  z-index: 0;
}

@media print {
  .navigation-drawer {
    display: none;
  }
}
</style>
