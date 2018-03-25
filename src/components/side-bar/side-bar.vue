<template>
  <aside class="side-bar">
    <m1-side-bar-nav/>
    <v-divider/>
    <div class="side-bar-tree">
      <m1-tree/>
    </div>
  </aside>
</template>

<script>
import M1Tree from '../tree/tree';
import M1SideBarNav from './side-bar-nav';

export default {
  components: {
    M1SideBarNav,
    M1Tree
  }
};
</script>

<style lang="scss" scoped>
.side-bar {
  width: 300px;
  min-width: 250px;
  max-width: 400px;
  margin: 0;
  /* border-right: 1px solid rgba(0, 0, 0, 0.12); */
  overflow-y: scroll;
}
</style>
