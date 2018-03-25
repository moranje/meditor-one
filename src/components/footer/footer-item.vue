<template>
  <v-flex
    v-bind="properties"
    text-xs-center
    white--text
  >
    <slot/>
  </v-flex>
</template>

<script>
export default {
  name: 'M1FooterBlock',

  props: {
    properties: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>
