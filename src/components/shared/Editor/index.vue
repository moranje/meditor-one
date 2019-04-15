<template lang="html">
  <VLayout
    fill-height
    align-center
    justify-center
  >
    <VFlex
      v-show="!visible"
      xs6
      sm4
      md2
    >
      <VProgressCircular
        :size="70"
        :width="7"
        color="primary"
        indeterminate
      />
    </VFlex>
    <article
      v-show="visible"
      ref="editor"
      class="editor"
    />
  </VLayout>
</template>

<script lang="js">
import { setup } from './monaco-base'
import Editor from '@/store/models/Editor'
import { emitter } from '@/components/Shared/emitter'

export default {
  name: 'Editor',

  props: {
    value: {
      type: String,
      default: ''
    },

    language: {
      type: String,
      default: 'snippet'
    },

    visible: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    editor () {
      return Editor.find(this.language)
    },

    width () {
      if (!this.editor) return 0

      return this.editor.width || 0
    },

    height () {
      if (!this.editor) return 0

      return this.editor.height || 0
    },

    viewportWidth () {
      if (!this.editor) return 0

      return this.editor.viewport.width || 0
    },

    viewportHeight () {
      if (!this.editor) return 0

      return this.editor.viewport.width || 0
    }
  },

  watch: {
    width (width) {
      if (width != null && this.editor.instance) {
        this.editor.instance.layout({ width, height: this.height })
      }
    },

    height (height) {
      if (height != null && this.editor.instance) {
        this.editor.instance.layout({ width: this.width, height })
      }
    },

    viewportWidth () {
      this.editor.instance.layout({ width: this.width, height: this.height })
    },

    viewportHeight () {
      this.editor.instance.layout({ width: this.width, height: this.height })
    },

    value (value) {
      if (this.editor && this.editor.instance && value) {
        let val = this.editor.instance.getValue()

        if (val !== value) this.editor.instance.setValue(value)
      }
    },

    visible (isVisible) {
      console.log(`${this.language} is visible`)
      emitter.emit(`${this.language}.visible`, { editor: this.editor.instance })
    }
  },

  mounted () {
    let instance = setup(this.$refs.editor, {
      value: this.value,
      language: this.language,
      theme: this.language
    })

    if (this.visible) {
      emitter.emit(`${this.language}.visible`, { editor: instance })
    }

    Editor.update({
      id: this.language,
      instance
    }).then(() => {
      this.loadEvents()
    })

    instance.layout({ width: this.width, height: this.height })
  },

  methods: {
    loadEvents () {
      this.editor.instance.onDidBlurEditorText((...args) => this.blur(args))
      this.editor.instance.onDidChangeModelContent((...args) => this.change(args))
      this.editor.instance.onKeyDown((...args) => this.change(args))
    },

    blur () {
      const value = this.editor.instance.getValue()

      this.$emit('blur', value)
    },

    change () {
      const value = this.editor.instance.getValue()

      this.$emit('change', value)
    }
  }
}
</script>

<style scoped lang="scss">
  .editor {
    // overflow-y: scroll;
    // height: calc(100%);
  }
</style>
