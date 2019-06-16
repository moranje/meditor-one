<template lang="html">
  <VFooter ref="footer" app fixed inset height="56">
    <VLayout align-center justify-space-around>
      <span>&copy; {{ year }}</span>
      <ModeDisplay />
    </VLayout>
    <ResizeObserver @notify="didResize" />
  </VFooter>
</template>

<script lang="js">
import ModeDisplay from './ModeDisplay'

export default {
  name: 'Footer',

  components: {
    ModeDisplay,
  },

  data () {
    return {
      year: new Date().getFullYear(),
    }
  },

  mounted() {
    this.didResize()
  },

  methods: {
    didResize() {
      this.$store.commit('addElement', {
        element: this.$refs.footer.$el,
        position: 'bottom',
        index: 0,
      })
    },
  },
}
</script>

<style scoped lang="scss">
.footer {
}
</style>
