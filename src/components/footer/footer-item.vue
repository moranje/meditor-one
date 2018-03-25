<template>
  <v-flex
    v-bind="properties"
    text-xs-center
    white--text
  >
    <slot></slot>
  </v-flex>
</template>

<script>
export default {
  name: 'm1-footer-block',

  props: {
    properties: {
      type: Object
    }
  }
};
</script>
