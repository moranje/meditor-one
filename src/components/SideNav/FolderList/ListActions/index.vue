<template lang="html">
  <Transition name="slide">
    <div class="list-actions">
      <VIcon
        :color="editMode ? 'primary' : 'grey lighten-1'"
        @click="edit"
        class="action action-edit"
      >
        mdi-pencil
      </VIcon>
      <VIcon @click="add" class="action action-add" color="grey lighten-1">
        mdi-folder-plus
      </VIcon>
      <VIcon
        @click="remove"
        class="action action-remove"
        color="grey lighten-1"
      >
        mdi-delete
      </VIcon>
    </div>
  </Transition>
</template>

<script lang="js">
export default {
  name: 'ListActions',

  props: {
    editMode: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    edit () {
      this.$emit('edit')
    },

    add () {
      this.$emit('add')
    },

    remove () {
      this.$emit('remove')
    },
  },
}
</script>

<style scoped lang="scss">
.list-actions {
  // padding-right: 4px;
}

.action:hover {
  color: rgba(0, 0, 0, 0.54) !important;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease-in-out;
}
.slide-enter,
.slide-leave-to {
  transform: translateX(48px);
  opacity: 0;
}
</style>
