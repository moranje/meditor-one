<template lang="html">
  <VFooter
    app
    fixed
    inset
    height="56"
  >
    <VLayout
      justify-center
      align-center
    >
      <span>&copy; {{ year }}</span>
    </VLayout>
  </VFooter>
</template>

<script lang="js">
export default {
  name: 'Footer',
  props: [],
  data () {
    return {
      year: new Date().getFullYear()
    }
  },
  computed: {

  },
  mounted () {},
  methods: {

  }
}
</script>

<style scoped lang="scss">
  .footer {

  }
</style>
