<template lang="html">
  <section class="text-label">
    <VTextField
      v-show="item.editable"
      :id="item.id"
      :ref="item.id"
      :value="item.name"
      :autofocus="item.editable"
      single-line
      full-width
      hide-details
      :class="`text-label-field text-label-${item.id}`"
      @blur="blur($event, item)"
      @keydown.enter="blur($event, item)"
    />

    <div
      v-show="!item.editable"
      class="text-label-text text-truncate"
      @dblclick="focus($event, item)"
    >
      {{ item.name }}
    </div>
  </section>
</template>

<script lang="js">
export default {
  name: 'TextLabel',

  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },

  methods: {
    focus (event, item) {
      this.$emit('text-focus', event, item)
    },

    blur (event, item) {
      this.$emit('text-blur', event, item)
    }
  }
}
</script>

<style lang="scss">
.text-label .text-label-field input {
  margin-top: 0;
  height: 24px;
}

.text-label .text-label-text {
  font-weight: 500;
  text-transform: uppercase;
}

.text-label .text-label-field > .v-input__control > .v-input__slot {
  padding: 0;
}
</style>
