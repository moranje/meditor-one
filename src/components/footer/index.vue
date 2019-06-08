<template lang="html">
  <VFooter app fixed inset height="56">
    <VLayout align-center justify-space-around>
      <span>&copy; {{ year }}</span>
      <ModeDisplay />
    </VLayout>
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
}
</script>

<style scoped lang="scss">
.footer {
}
</style>
