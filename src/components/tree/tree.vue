<template>
  <v-list v-if="!user">
    <v-list-tile avatar>
      <v-list-tile-avatar>
        <v-icon>mdi-alert</v-icon>
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title>Empty list...</v-list-tile-title>
        <v-list-tile-sub-title>You should try logging in!</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
  <v-list
    v-else
    class="m1-tree"
  >
    <template v-for="(folder, index) in folders">
      <m1-tree-folder
        :folder="folder"
        :key="folder.key"
      />
      <m1-tree
        v-if="folder.folders || folder.files"
        :key="'tree' + index"
        :folder-ids="folder.folders"
        :file-ids="folder.files"
        :level="levelUp"
      />
    </template>
    <m1-tree-file
      v-for="file in files"
      :file="file"
      :key="file.id"
    />
  </v-list>
</template>

<script>
import m1TreeFolder from './tree-folder';
import m1TreeFile from './tree-file';

export default {
  name: 'M1Tree',

  components: {
    m1TreeFolder,
    m1TreeFile
  },

  props: {
    folderIds: {
      type: Object,
      default: () => ({})
    },
    fileIds: {
      type: Object,
      default: () => ({})
    },
    level: {
      type: Number,
      default: 0
    }
  },

  computed: {
    folders() {
      const root = this.$store.getters.findFolder('isRoot', true);
      if (+this.level === 0 && root) {
        return [root];
      }

      const folders = this.$store.getters.findManyFolders(this.folderIds);
      if (folders.length > 0) return folders;

      // Return a dummy root folder
      return [];
    },

    files() {
      return this.$store.getters.findManyFiles(this.fileIds);
      // if (files.length > 0) {
      //   return files.sort((a, b) => a.name >= b.name);
      // }

      // return [];
    },

    levelUp() {
      return this.level + 1;
    },

    user() {
      return this.$store.getters.getUser;
    }
  }
};
</script>

<style lang="scss">
@import '../../assets/variables';

.m1-tree.list {
  // Even heigth between lists
  padding: 0;

  .list__tile--link {
    border-left: 4px solid white;
  }

  .list__tile--link:hover {
    background: rgba(0, 0, 0, 0.06);
    border-left: 4px solid rgba($accent, 0.5);
  }

  .list__tile--active {
    background: rgba(0, 0, 0, 0.12);
    border-left: 4px solid $accent;
  }

  .list__tile {
    padding: 0 6px;

    .list__tile__action i {
      margin: 0 auto;
    }
  }

  .list {
    .list__tile {
      padding-left: 12px;
    }
    .list {
      .list__tile {
        padding-left: 18px;
      }
      .list {
        .list__tile {
          padding-left: 24px;
        }
        .list {
          .list__tile {
            padding-left: 30px;
          }
          .list {
            .list__tile {
              padding-left: 36px;
            }
          }
        }
      }
    }
  }
}
</style>
