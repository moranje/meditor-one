<template lang="html">
  <Transition name="slide">
    <div class="list-actions">
      <VIcon
        class="action action-edit"
        :color="editMode ? 'primary' : 'grey lighten-1'"
        @click="edit"
      >
        mdi-pencil
      </VIcon>
      <VIcon class="action action-add" color="grey lighten-1" @click="add">
        mdi-folder-plus
      </VIcon>
      <VIcon
        class="action action-remove"
        color="grey lighten-1"
        @click="remove"
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
