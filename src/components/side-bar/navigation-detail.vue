<template>
  <v-layout
    fill-height
    column
    class="navigation-detail">
    <m1-side-bar-nav d-flex />
    <v-divider/>
    <div
      d-flex
      class="explorer">
      <m1-tree/>
    </div>
  </v-layout>
</template>

<script>
import M1Tree from '../tree';
import M1SideBarNav from './side-bar-nav';

export default {
  components: {
    M1SideBarNav,
    M1Tree
  }
};
</script>

<style lang="scss" scoped>
hr.divider {
  flex: 0;
}
.explorer {
  overflow-y: scroll;
}
</style>
