<script lang="ts">
import Vue from 'vue'
import VueWithCompiler from 'vue/dist/vue.esm'
import MarkdownIt from 'markdown-it'
import MarkdownItContainer from 'markdown-it-container'
import CodeBlock from '../CodeBlock/index.vue'
import 'github-markdown-css'

export default Vue.extend({
  name: 'Markdown',

  components: {
    // eslint-disable-next-line vue/no-unused-components
    CodeBlock,
  },

  props: {
    value: {
      type: String,
      default: '',
    },
  },

  data: () => ({
    base: new MarkdownIt().use(MarkdownItContainer, 'snippet', {
      validate: function(params) {
        return params.trim().match(/^snippet\s+.*$/)
      },
      render: (tokens, index) => {
        var match = tokens[index].info.trim().match(/^snippet\s+(.*)$/)

        if (tokens[index].type === 'container_snippet_open') {
          let idx = index + 1 // Start after opening token
          let content = ''

          // stop before closing token
          while (tokens[idx].type !== 'container_snippet_close') {
            if (tokens[idx].type === 'inline') {
              // Add removed newlines
              content += `${tokens[idx].content}\n\n`
            }
            idx += 1
          }

          return `<code-block class="code-block" title="${
            match[1]
          }" md="${content.trim()}" type="snippet">`
        } else {
          return '</code-block>'
        }
      },
    }),
  }),

  computed: {
    compiled() {
      return this.compile(this.value)
    },
  },

  methods: {
    compile(value) {
      var res = VueWithCompiler.compile(`<div>${this.base.render(value)}</div>`)

      // staticRenderFns belong into $options,
      // appearantly
      this.$options.staticRenderFns = []

      // clean the cache of static elements
      // this is a cache with the results from the staticRenderFns
      this._staticTrees = []

      // Fill it with the new staticRenderFns
      for (var i in res.staticRenderFns) {
        // staticRenderFns.push(res.staticRenderFns[i]);
        this.$options.staticRenderFns.push(res.staticRenderFns[i])
      }

      return res.render
    },
  },

  render(h) {
    if (!this.compiled) {
      return h('div', 'loading...')
    } else {
      // If there is a template, I'll show it
      return this.compiled()
    }
  },
})
</script>

<style lang="scss">
.markdown-body {
  code {
    box-shadow: none;
    color: inherit;
    display: inline;
  }
}
</style>
