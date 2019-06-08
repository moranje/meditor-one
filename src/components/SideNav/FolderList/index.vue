<template lang="html">
  <article class="folder-list-container">
    <VTreeview
      v-model="tree"
      :open="collapsed"
      :active="activeFolder"
      :items="items"
      item-key="id"
      :multiple-active="false"
      item-children="folders"
      hoverable
      activatable
      transition
      class="folder-list"
      @update:open="openFolder"
      @update:active="activated"
    >
      <template slot="prepend" slot-scope="{ item, open }">
        <VIcon> {{ open ? 'mdi-folder-open' : 'mdi-folder' }} </VIcon>
      </template>

      <template slot="label" slot-scope="{ item }">
        <VTextField
          v-if="item.editable"
          :ref="item.id"
          :value="item.name"
          :autofocus="item.editable"
          single-line
          full-width
          hide-details
          class="label-display"
          @blur="focusLose($event, item)"
          @keydown.enter="focusLose($event, item)"
        />

        <div
          v-if="!item.editable"
          class="label-display text-truncate"
          @dblclick="focusGain($event, item)"
        >
          {{ item.name }}
        </div>
      </template>

      <template slot="append" slot-scope="{ item, active }">
        <ListActions
          v-show="active || item.editable"
          :edit-mode="item.editable"
          @add="add(item)"
          @edit="
            item.editable ? focusLose($event, item) : focusGain($event, item)
          "
          @remove="remove(item)"
        />
      </template>
    </VTreeview>
  </article>
</template>

<script lang="js">
import ListActions from '@/components/SideNav/FolderList/ListActions'
import Folder from '@/store/models/Folder'
import Editor from '@/store/models/Editor'
import { db } from '@/plugins/firebase'
import difference from 'lodash.difference'

export default {
  name: 'FolderList',

  components: {
    ListActions,
  },

  props: {
    items: {
      type: Array,
      default: () => [],
    },

    collapsed: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      tree: [],
      activeFolder: [],
      hidden: true,
    }
  },

  // computed: {
  //   activeFolder() {
  //     console.log('ACTIVATE FOLDER', arguments, this.$route.params.folderId)
  //     if (this.$route.params.folderId) return [this.$route.params.folderId]

  //     console.log('ACTIVATE FOLDER 2', this.$route.params.folderId)

  //     return []
  //   }
  // },

  watch: {
    '$route' (to, from) {
      if (to.name === 'templates') {
        // console.log('ROUTE WILL BE ACTIVATED', this, to.params.folderId)
        this.activeFolder = [to.params.folderId]
      }
    },
  },

  mounted () {},

  methods: {
    openFolder (newValue) {
      let { id, collapsed } = this.difference(newValue, this.collapsed)
      let folder = Folder.query().with('parent').find(id)
      let rootFolders = Folder.query()
        .where('parentId', null)
        .all()
        .map(rootFolder => rootFolder.id)

      // Accordian style collapse (root folder have no parents)
      if (folder && rootFolders.indexOf(folder.id) !== -1) {
        Folder.update({
          where: record => rootFolders.indexOf(record.id) !== -1,

          data: { collapsed: true },
        })
      }

      // Accordian style collapse
      if (folder && folder.parent) {
        Folder.update({
          where: record => folder.parent.folderIds.indexOf(record.id) !== -1,

          data: { collapsed: true },
        })
      }

      // Open or collapse folder clicked on
      if (id) {
        Folder.update({
          where: id,
          data: { collapsed },
        })
      }
    },

    activated([id]) {
      // console.log('ACTIVATED', { folderId: this.$route.params.folderId, activeFolder: this.activeFolder })

      if (id) {
        // console.log('WITH ID', arguments)
        this.$router.push({ path: `/templates/${id}` })
        // this.activeFolder = [id]
      } else if (this.$route.params.folderId && this.activeFolder.indexOf(this.$route.params.folderId) === -1) {
        // console.log('WITHOUT ID', id)
        // debugger
        this.activeFolder.push(this.$route.params.folderId)
      }
    },

    add (item) {
      const ref = db.collection(`owner/folders/${this.$user.uid}`).doc()

      Folder.insert({
        data: {
          id: ref.id,
          name: '',
          ownerId: this.$user.uid,
          parentId: item.id,
        },
      })

      // Add relationship data to parent. Also uncollapse parent to edit child.
      Folder.update({
        where: item.id,
        data: {
          folderIds: [ref.id, ...item.folderIds],
          collapsed: false,
        },
      })
    },

    focusGain (event, item) {
      Folder.update({ where: item.id, data: { editable: true } })
    },

    focusLose (event, item) {
      // Prevent keydown keydown from triggering an update, since blur fires
      // anyway.
      if (event.type === 'keydown') {
        return this.$refs[item.id].$el.querySelector('input').blur()
      }

      let value = this.$refs[item.id].$el.querySelector('input').value

      if (value === '') {
        this.remove(item)
      } else {
        Folder.update({
          where: item.id,
          data: { name: value, editable: false },
        })
      }
    },

    remove(item) {
      // const ref = db.collection(`owner/folders/${this.$user.uid}`).doc();
      let parent = Folder.find(item.parentId)

      Folder.delete(item.id)

      // Remove child reference on parent folder
      if (parent && parent.folderIds) {
        parent.folderIds.splice(
          parent.folderIds.indexOf(item.id),
          1
        )

        Folder.update({
          id: item.parentId,
          collapsed: true,
          folderIds: parent.folderIds,
        })
      }
    },

    difference(source, target) {
      let [diffSource] = difference(source, target)
      let [diffTarget] = difference(target, source)

      // console.log('DIFFERENCE', source, diffSource, target, diffTarget);

      if (diffSource) return { id: diffSource, collapsed: false }

      if (diffTarget) return { id: diffTarget, collapsed: true }

      return { id: null, collapsed: null }
    },
  },
}
</script>

<style lang="scss">
.folder-list-container {
  overflow-y: hidden;
  height: calc(100% - 64px - 201px); // 100% - navbar - navigation links
}

.folder-list {
  overflow-y: scroll;
  height: 100%;

  .v-treeview-node__root:hover {
    background: rgba(0, 0, 0, 0.04) !important;
  }

  .v-treeview-node--active {
    background: rgba(0, 0, 0, 0) !important;

    .v-icon.mdi {
      color: #1565c0; // Primary
    }

    .label-display {
      color: #1565c0; // Primary
    }
  }

  // .v-treeview-node {
  //   margin-left: 0;
  // }
  .v-treeview-node__children {
    margin-left: -26px;

    // .v-treeview-node__root {
    //   margin-left: 0;
    // }

    .v-treeview-node--leaf {
      // margin-left: 24px;
    }
  }

  .v-treeview-node__label {
    width: 180px;
  }

  .label-display {
    font-size: 14px;
    font-weight: 500;

    &.text-truncate {
      padding: 0 12px;
    }
  }

  .v-treeview-node__label {
    margin-left: 0;
  }
}
</style>
