<template>
  <v-layout
    fill-height
    row
    class="side-bar"
    tag="aside">
    <m1-navigation-drawer style="min-width: 80px;"/>
    <m1-navigation-detail d-flex/>
  </v-layout>
</template>

<script>
import M1NavigationDrawer from './navigation-drawer';
import M1NavigationDetail from './navigation-detail';

export default {
  components: {
    M1NavigationDrawer,
    M1NavigationDetail
  }
};
</script>

<style lang="scss" scoped>
.side-bar {
  width: 380px;
  min-width: 330px;
  max-width: 580px;
  margin: 0;
  /* border-right: 1px solid rgba(0, 0, 0, 0.12); */
}

@media print {
  .side-bar {
    display: none;
  }
}
</style>
