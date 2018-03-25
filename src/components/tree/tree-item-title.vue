<template>
  <v-text-field
    v-if="editable"
    :value="value"
    color="grey darken-2"
    autofocus
    single-line
    @keyup.83="handleSave"
    @input="onEdit"
    @keyup.enter="onChangeEditMode"
    @blur.native="onChangeEditMode"
  />
  <v-list-tile-title
    v-else
    class="grey--text text--darken-2"
    @dblclick="onChangeEditMode"
  >{{ value }}</v-list-tile-title>
</template>

<script>
export default {
  props: {
    editable: {
      type: Boolean,
      default: false
    },
    value: {
      type: String
    }
  },

  methods: {
    handleSave(event) {
      if (event.metaKey || event.ctrlKey) {
        this.onChangeEditMode();
      }
    },

    onEdit(text) {
      this.$emit('onEdit', text);
    },

    onChangeEditMode() {
      this.$emit('onChangeEditMode', !this.editable);
    }
  }
};
</script>

<style lang="scss">
.input-group {
  padding: 5px 0 0;
}
</style>
