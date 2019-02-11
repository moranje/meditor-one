<template lang="html">
  <VList
    ref="filelist"
    three-line
    subheader
    class="file-list"
    transition="slide-x-transition"
  >
  <template
    v-for="file in files"
  >

    <VListTile
      :key="file.id"
      avatar
      :to="{ path: `/templates/${$route.params.folder_id}/${file.id}` }"
    >
      <VListTileAvatar class="three-line-avatar">
        <VIcon class="grey lighten-1 white--text">mdi-file</VIcon>
      </VListTileAvatar>

      <VListTileContent>
        <VListTileTitle>
          <TextLabel
            :item="file"
            @text-focus="focus($event, file)"
            @text-blur="blur($event, file)"
          />
        </VListTileTitle>
        <VListTileSubTitle>{{ file.value }}</VListTileSubTitle>
      </VListTileContent>

      <VListTileAction>
        <VBtn
          icon
          ripple
          class="edit"
          @click="file.editable ? blur($event, file) : focus($event, file)"
        >
          <VIcon :color="!file.editable ? 'grey lighten-1' : 'primary'">
            mdi-pencil
          </VIcon>
        </VBtn>
      </VListTileAction>
      <VListTileAction>
        <VBtn
          icon
          ripple
          class="delete"
          @click="remove(file)"
        >
          <VIcon color="grey lighten-1">
            mdi-delete
          </VIcon>
        </VBtn>
      </VListTileAction>
    </VListTile>

    <v-divider
      :key="`divider-${file.id}`"
    ></v-divider>

    </template>

    <resize-observer @notify="handleResize" />
  </VList>
</template>

<script lang="js">
import File from '@/store/models/File'
import Folder from '@/store/models/Folder'
import Editor from '@/store/models/Editor';

import { db } from '@/plugins/firebase';
import TextLabel from '@/components/shared/TextLabel'

export default {
  name: 'FileList',

  metaInfo: {
    title: 'Templates',
  },

  components: {
    TextLabel
  },

  props: {
    files: {
      type: Array,
      default: () => [],
    },
  },

  computed: {

  },

  mounted() {
    Editor.insertOrUpdate({
      data: [
        Object.assign({ id: 'snippet'}, this.getSize()),
        Object.assign({ id: 'status'}, this.getSize()),
      ]
    });
  },

  destroyed() {
    Editor.insertOrUpdate({
      data: [
        Object.assign({ id: 'snippet'}, this.getSize(), {
          filelist: { width: 0, height: 0}
        }),
        Object.assign({ id: 'status'}, this.getSize(), {
          filelist: { width: 0, height: 0}
        }),
      ]
    });
  },

  methods: {
    route(file, { folder_id,}) {
      if (folder_id && file.id) this.$router.push({
        path: `/templates/${folder_id}/${file.id}`
      });
    },

    focus(event, item) {
      File.update({ where: item.id, data: { editable: true } }).then(() => {
        document.querySelector(`#${item.id}`).focus();
      })

    },

    blur(event, item) {
      // Prevent blur event from triggering when clicking the edit button
      if (event.relatedTarget && event.relatedTarget.classList.contains('edit')) return

      // Prevent blur event from being triggered twice
      if (event.type === 'keydown') {
        return document.querySelector(`#${item.id}`).blur();
      }

      let value = document.querySelector(`#${item.id}`).value;
      File.update({ where: item.id, data: { name: value, editable: false } })
    },

    remove(file) {
      let parent = Folder.find(file.parentId)

      File.delete(file.id)

      // Remove child reference on parent folder
      if (parent && parent.fileIds) {
        parent.fileIds.splice(
          parent.fileIds.indexOf(file.id),
          1
        )

        Folder.update({
          id: file.parentId,
          collapsed: true,
          fileIds: parent.fileIds,
        })
      }
    },

    handleResize() {
      Editor.insertOrUpdate({
        data: [
          Object.assign({ id: 'snippet'}, this.getSize()),
          Object.assign({ id: 'status'}, this.getSize()),
        ]
      });
    },

    getSize() {
      return {
        filelist: {
          width: this.$el.clientWidth,
          height: this.$el.clientHeight
        },
        viewport: {
          width: Math.max(
            document.documentElement.clientWidth,
            window.innerWidth || 0
          ),
          height: Math.max(
            document.documentElement.clientHeight,
            window.innerHeight || 0
          )
        }
      }
    }
  },
}
</script>

<style scoped lang="scss">
  .file-list {
    overflow-y: scroll;
    height: 100%;

    .v-list__tile__action {
      min-width: 36px;
    }

    .three-line-avatar {
      margin-top: 0;
    }

  }
</style>
