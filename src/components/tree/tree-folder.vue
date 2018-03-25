<template>
  <v-list-tile
    v-if="!folder.hidden"
    @click="toggleCollapse"
  >
    <v-list-tile>
      <v-icon v-if="folder.collapsed">mdi-folder</v-icon>
      <v-icon v-else>mdi-folder-outline</v-icon>
    </v-list-tile>
    <v-list-tile-content>
      <m1-tree-item-title
        :value="folder.name"
        :editable="folder.editable"
        @onEdit="update"
        @onChangeEditMode="changeEditMode"
      />
    </v-list-tile-content>
    <v-list-tile-action @click.stop="changeEditMode(!folder.editable)">
      <v-tooltip top>
        <v-icon
          slot="activator"
          size="20px"
          color="grey lighten-1"
        >mdi-pencil</v-icon>
        <span>edit</span>
      </v-tooltip>
    </v-list-tile-action>
    <v-list-tile-action @click.stop="addFile">
      <v-tooltip top>
        <v-icon
          slot="activator"
          size="20px"
          color="grey lighten-1"
        >mdi-file-plus</v-icon>
        <span>new file</span>
      </v-tooltip>
    </v-list-tile-action>
    <v-list-tile-action @click.stop="addFolder">
      <v-tooltip top>
        <v-icon
          slot="activator"
          size="20px"
          color="grey lighten-1"
        >mdi-folder-plus</v-icon>
        <span>new folder</span>
      </v-tooltip>
    </v-list-tile-action>
    <v-list-tile-action @click.stop="remove">
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

function collapse(folderIds, fileIds) {
  const folders = this.$store.getters.findManyFolders(folderIds);
  const files = this.$store.getters.findManyFiles(fileIds);

  folders.forEach(folder => {
    this.$store.dispatch('updateFolder', {
      id: folder['.key'],
      key: 'hidden',
      value: !this.folder.collapsed
    });

    collapse.call(this, folder.folders, []);
  });

  files.forEach(file =>
    this.$store.dispatch('updateFile', {
      id: file['.key'],
      key: 'hidden',
      value: !this.folder.collapsed
    })
  );
}

function newFolder(
  name = '',
  folders = {},
  files = {},
  isRoot = false,
  collapsed = false
) {
  return {
    name,
    folders,
    files,
    isRoot,
    collapsed,
    editable: true,
    type: 'folder'
  };
}

function newFile(
  name = '',
  value = '',
  extension = 'snippet',
  snippet = {},
  hidden = false
) {
  return {
    name,
    value,
    extension,
    snippet,
    hidden,
    editable: true,
    type: 'file'
  };
}

export default {
  components: {
    m1TreeItemTitle
  },

  props: {
    folder: Object,
    level: Number
  },

  methods: {
    toggleCollapse() {
      // if (!this.folder.collapsed) {
      collapse.call(this, this.folder.folders, this.folder.files);
      // }

      this.$store.dispatch('updateFolder', {
        id: this.folder['.key'],
        key: 'collapsed',
        value: !this.folder.collapsed
      });
    },

    changeEditMode(isEditable) {
      if (this.folder.editable) {
        this.$store.dispatch('updateFolder', {
          id: this.folder['.key'],
          key: 'name',
          value: this.folder.name
        });
      }

      this.$store.dispatch('updateFolder', {
        id: this.folder['.key'],
        key: 'editable',
        value: isEditable
      });
    },

    addFolder() {
      this.$store.dispatch('createFolder', {
        folder: newFolder(),
        parent: this.folder['.key']
      });
    },

    addFile() {
      this.$store.dispatch('createFile', {
        file: newFile(),
        parent: this.folder['.key']
      });

      // Prevents the last entered file name to appear on file creation
      this.value = '';
    },

    update(value) {
      this.$store.commit('updateFolderLocal', {
        id: this.folder['.key'],
        key: 'name',
        value
      });
    },

    remove() {
      this.$store.dispatch('removeFolder', this.folder['.key']);
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
