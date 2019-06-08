<template>
  <VLayout :style="`height: ${height}px`" class="docs">
    <VFlex class="doc-list" xs3>
      <VList ref="docList" class="docs" transition="slide-x-transition">
        <template v-for="doc in docs">
          <VListTile
            :key="doc.name"
            :to="{ path: `/docs/${doc.name.toLowerCase()}/` }"
          >
            <VListTileContent>
              <VListTileTitle>{{ doc.name }}</VListTileTitle>
            </VListTileContent>
          </VListTile>

          <VDivider :key="`divider-${doc.name}`" />
        </template>

        <ResizeObserver @notify="handleResize" />
      </VList>
    </VFlex>

    <VDivider vertical />

    <VFlex class="doc-file" xs9>
      <RouterView />
    </VFlex>
  </VLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import UI from '@/store/models/UI'
import sortBy from 'lodash.sortby'

export default Vue.extend({
  name: 'Docs',

  data: () => ({
    docs: sortBy(
      [
        {
          name: 'Placeholder',
        },
        {
          name: 'Choice',
        },
        {
          name: 'Variable',
        },
        {
          name: 'Expansion',
        },
        {
          name: 'Slot',
        },
        {
          name: 'Action',
        },
      ],
      'name'
    ),
  }),

  computed: {
    viewport() {
      const viewport = UI.find('viewport')

      if (viewport) return viewport.height

      return 0
    },

    navbar() {
      const navbar = UI.find('navbar')

      if (navbar) return navbar.height

      return 0
    },

    height() {
      const FOOTER = 56

      if (!this.viewport || !this.navbar) return 0

      return this.viewport - this.navbar - FOOTER
    },
  },

  mounted() {
    this.handleResize()
  },

  destroyed() {
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
    handleResize() {
      const MARGIN = 20
      const DIVIDER = 1

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
            width: this.$refs.docList.$el.clientWidth + 2 * MARGIN + DIVIDER,
            height: this.$refs.docList.$el.clientHeight,
          },
        ],
      })
    },
  },
})
</script>

<style scoped lang="scss">
.docs {
  overflow-y: hidden;
}

.doc-list {
  background-color: white;
  overflow-y: scroll;
}

.doc-file {
  padding: 20px;
  background-color: white;
  overflow-y: scroll;
}
</style>
