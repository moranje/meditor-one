<template lang="html">
  <VList
    ref="filenav"
    three-line
    subheader
    class="file-list"
    transition="slide-x-transition"
  >
    <template v-for="file in files">
      <VListTile
        :key="file.id"
        :to="{ path: `/templates/${$route.params.folderId}/${file.id}` }"
        avatar
      >
        <!-- <VListTileAvatar class="three-line-avatar hidden-md-and-down">
          <VIcon class="grey lighten-1 white--text">
            mdi-file
          </VIcon>
        </VListTileAvatar> -->

        <VListTileContent>
          <VListTileTitle class="action-container">
            <TextLabel
              :item="file"
              class="action-text"
              @text-focus="focus($event, file)"
              @text-blur="blur($event, file)"
            />

            <VBtn
              v-aria="aria.edit"
              icon
              ripple
              class="edit action-icon"
              @click="file.editable ? blur($event, file) : focus($event, file)"
            >
              <VIcon
                :color="!file.editable ? 'grey lighten-1' : 'primary'"
                size="20"
              >
                mdi-pencil
              </VIcon>
            </VBtn>
            <VBtn
              v-aria="aria.del"
              icon
              ripple
              class="delete action-icon"
              @click="remove(file)"
            >
              <VIcon size="20" color="grey lighten-1">
                mdi-delete
              </VIcon>
            </VBtn>
          </VListTileTitle>
          <VListTileSubTitle>{{ file.value }}</VListTileSubTitle>
        </VListTileContent>

        <!-- <VListTileAction>
          <VIcon
            size="20"
            :color="!file.editable ? 'grey lighten-1' : 'primary'"
          >
            mdi-pencil
          </VIcon>
          <VIcon
            size="20"
            color="grey lighten-1"
          >
            mdi-delete
          </VIcon> -->
        <!-- <VBtn
            icon
            ripple
            class="edit"
            @click="file.editable ? blur($event, file) : focus($event, file)"
          >
            <VIcon :color="!file.editable ? 'grey lighten-1' : 'primary'">
              mdi-pencil
            </VIcon>
          </VBtn> -->
        <!-- </VListTileAction> -->
        <!-- <VListTileAction>
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
        </VListTileAction> -->
      </VListTile>

      <VDivider :key="`divider-${file.id}`" />
    </template>

    <ResizeObserver @notify="handleResize" />
  </VList>
</template>

<script lang="js">
import { directiveAria } from 'vue-a11y-utils'
import File from '@/store/models/File'
import Folder from '@/store/models/Folder'
import Editor from '@/store/models/Editor'
import UI from '@/store/models/UI'

import { db } from '@/plugins/firebase'
import TextLabel from '@/components/Shared/TextLabel'

export default {
  name: 'FileList',

  metaInfo: {
    title: 'Templates',
  },

  directives: {
    aria: directiveAria,
  },

  components: {
    TextLabel,
  },

  props: {
    files: {
      type: Array,
      default: () => ([]),
    },
  },

  data: function() {
    return {
      aria: {
        edit: {
          label: 'wijzig naam van template',
        },

        del: {
          label: 'verwijder template',
        },
      },
    }
  },

  computed: {

  },

  // watch: {
  //   files(...args) {
  //     // console.log('FILES', args)
  //   },
  // },

  mounted () {
    this.handleResize()
  },

  destroyed () {
    UI.insertOrUpdate({
      data: [
        {
          id: 'filenav',
          width: 0,
          height: 0,
        },
      ],
    })
  },

  methods: {
    focus (event, item) {
      File.update({ where: item.id, data: { editable: true } }).then(() => {
        document.querySelector(`#${item.id}`).focus()
      })
    },

    blur (event, item) {
      // Prevent blur event from triggering when clicking the edit button
      if (event.relatedTarget && event.relatedTarget.classList.contains('edit')) return

      // Prevent blur event from being triggered twice
      if (event.type === 'keydown') {
        return document.querySelector(`#${item.id}`).blur()
      }

      let value = document.querySelector(`#${item.id}`).value
      File.update({ where: item.id, data: { name: value, editable: false } })
    },

    remove (file) {
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

    handleResize () {
      UI.insertOrUpdate({
        data: [
          {
            id: 'viewport',
            width: Math.max(
              document.documentElement.clientWidth,
              window.innerWidth || 0
            ),
            height: Math.max(
              document.documentElement.clientHeight,
              window.innerHeight || 0
            ),
          },
          {
            id: 'filenav',
            width: this.$el.clientWidth,
            height: this.$el.clientHeight,
          },
        ],
      })
    },
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

.action-container {
  display: flex;

  .action-text {
    width: calc(100% - 48px);
  }

  .action-icon {
    position: relative;
    top: -4px;
    margin: 0;
    width: 24px;
    height: 24px;
    color: transparent;
    // padding: 0 2px 0 2px

    &:hover {
      .v-icon {
        color: rgba(0, 0, 0, 0.54) !important;
      }
    }
  }
}
</style>
