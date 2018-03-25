<template>
  <!-- TODO: hide when file.hidden OR when parent.collapsed -->
  <v-list-tile
    v-if="visible"
    :to="{ name: 'file', params: { id: file['.key'] }}"
  >
    <v-list-tile>
      <v-icon>mdi-file</v-icon>
    </v-list-tile>
    <v-list-tile-content>
      <m1-tree-item-title
        :value="file.name"
        :editable="file.editable"
        @onEdit="update"
        @onChangeEditMode="changeEditMode"
      />
    </v-list-tile-content>
    <v-list-tile-action @click="changeEditMode(!file.editable)">
      <v-tooltip top>
        <v-icon
          slot="activator"
          size="20px"
          color="grey lighten-1"
        >mdi-pencil</v-icon>
        <span>edit</span>
      </v-tooltip>
    </v-list-tile-action>
    <v-list-tile-action @click="remove">
      <v-tooltip top>
        <v-icon
          slot="activator"
          size="20px"
          color="grey lighten-1"
        >mdi-delete</v-icon>
        <span>delete</span>
      </v-tooltip>
    </v-list-tile-action>
  </v-list-tile>
</template>

<script>
import m1TreeItemTitle from './tree-item-title';

export default {
  components: {
    m1TreeItemTitle
  },

  props: {
    file: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    parent() {
      return this.$store.getters.findFolder(
        '.key',
        Object.keys(this.file.folder)[0]
      );
    },

    visible() {
      if (this.file.hidden) {
        return false;
      }

      if (this.parent.collapsed || this.parent.hidden) {
        return false;
      }

      return true;
    }
  },

  methods: {
    changeEditMode(isEditable) {
      if (this.file.editable) {
        this.$store.dispatch('updateFile', {
          id: this.file['.key'],
          key: 'name',
          value: this.file.name
        });
      }

      this.$store.dispatch('updateFile', {
        id: this.file['.key'],
        key: 'editable',
        value: isEditable
      });
    },

    update(value) {
      this.$store.commit('updateFileLocal', {
        id: this.file['.key'],
        key: 'name',
        value
      });
    },

    remove() {
      this.$store.dispatch('removeFile', {
        id: this.file['.key'],
        parent: this.file.folder
      });
      this.$router.push({ name: 'document' });
    }
  }
};
</script>

<style lang="scss" scoped>
.list__tile__action {
  min-width: 30px;
  opacity: 0;
}

.list__tile:hover .list__tile__action {
  opacity: 0.5;
  &:hover {
    opacity: 1;
  }
}

.icon.grey--text.text--lighten-1.mdi {
  line-height: 30px;
}
</style>
