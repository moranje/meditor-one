<template>
  <v-footer color="primary">
    <v-layout
      row
      wrap
      justify-space-between
    >
      <v-flex
        xs11
        text-xs-center
        white--text
      >
        &copy; {{ new Date().getFullYear() }} —
        <strong v-if="user">{{ user.displayName }}</strong>
        <strong v-else>M. Oranje</strong>
      </v-flex>
      <v-flex
        xs1
        text-xs-center
        white--text
      >
        <v-tooltip top>
          <v-icon
            slot="activator"
            :color="saveStateStyle"
            size="10px"
            class="tooltip-top"
          >mdi-circle</v-icon>
          <span>{{ saveState }}</span>
        </v-tooltip>
      </v-flex>
    </v-layout>
  </v-footer>
</template>

<script>
import M1FooterBlock from './footer-item';
import M1Editor from '../editor/editor';

console.log('M1FooterBlock', M1FooterBlock);
console.log('M1Editor', M1Editor);

export default {
  components: {
    M1FooterBlock
  },

  computed: {
    user() {
      return this.$store.getters.getUser;
    },

    saveState() {
      return this.$store.getters.getSaveState();
    },

    saveStateStyle() {
      if (this.saveState === 'saved') {
        return 'success';
      }

      if (this.saveState === 'local') {
        return 'warning';
      }

      return 'error';
    }
  }
};
</script>

<style lang="scss" scoped>
.footer {
  width: 100%;
  height: 32px;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

.tooltip-top {
  line-height: 25px;
}
</style>
