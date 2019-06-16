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
      </VList>
    </VFlex>

    <VDivider vertical />

    <VFlex class="doc-file" xs9>
      <RouterView />
    </VFlex>
    <ResizeObserver @notify="didResize" />
  </VLayout>
</template>

<script lang="ts">
import Vue from 'vue'
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
    height() {
      if (this.$store.getters.main) return this.$store.getters.main.height

      return 0
    },
  },

  mounted() {
    this.didResize()
  },

  destroyed() {
    this.$store.commit('removeElement', {
      position: 'left',
      index: 2,
    })
    this.$store.commit('removeElement', {
      position: 'left',
      index: 1,
    })
  },

  methods: {
    didResize() {
      this.$store.commit('addElement', {
        element: this.$refs.docList.$el,
        position: 'left',
        index: 1,
      })

      this.$store.commit('addElement', {
        element: {
          clientWidth: 40,
        },
        position: 'left',
        index: 2,
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
