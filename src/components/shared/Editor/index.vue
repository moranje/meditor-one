<template lang="html">
  <VLayout ref="editorContainer" fill-height align-center justify-center>
    <VFlex v-show="!visible" xs6 sm4 md2>
      <VProgressCircular :size="70" :width="7" color="primary" indeterminate />
    </VFlex>
    <article v-show="visible" ref="editor" class="editor" />
    <ResizeObserver @notify="handleResize" />
  </VLayout>
</template>

<script lang="js">
import { setup } from './monaco-base'
import Editor from '@/store/models/Editor'
import UI from '@/store/models/UI'
import { emitter } from '@/components/Shared/emitter'
import uniqid from 'uniqid'

export default {
  name: 'Editor',

  props: {
    value: {
      type: String,
      default: '',
    },

    language: {
      type: String,
      default: 'snippet',
    },

    visible: {
      type: Boolean,
      default: false,
    },

    linesAsHeight: {
      type: Boolean,
      default: false,
    },

    uid: {
      type: String,
      default: '',
    },
  },

  computed: {
    editorId() {
      if (this.uid === '') return uniqid()

      return this.uid
    },

    editor () {
      const editor = Editor.find(this.editorId)

      if (!editor) return null

      return editor.instance
    },

    viewport() {
      return UI.find('viewport')
    },

    navbar() {
      const navbar = UI.find('navbar')

      if (navbar) return navbar.height

      return 0
    },

    sidenav() {
      const sidenav = UI.find('sidenav')

      if (sidenav) return sidenav.width

      return 0
    },

    filenav() {
      const filenav = UI.find('filenav')

      if (filenav) return filenav.width

      return 0
    },

    lines() {
      if (!this.editor) return 0

      return this.editor.getModel().getLineCount()
    },

    width () {
      if (!this.viewport || !this.sidenav) return 0

      if (this.filenav) {
        return this.viewport.width - this.sidenav - this.filenav
      }

      return this.viewport.width - this.sidenav
    },

    height () {
      const LINE_HEIGHT = 20
      const FOOTER = 56

      if (this.linesAsHeight) {
        return LINE_HEIGHT * +this.lines
      }

      if (!this.viewport || !this.navbar) return 0

      return this.viewport.height - this.navbar - FOOTER
    },
  },

  watch: {
    value (value) {
      if (this.editor && this.editor && value) {
        let val = this.value || this.editor.getValue()

        if (val !== value) this.editor.setValue(value)
      }
    },

    visible (isVisible) {
      emitter.emit(`${this.language}.visible`, { editor: this.editor })
    },
  },

  mounted () {
    let instance = setup(this.$refs.editor, {
      value: this.value,
      language: this.language,
      theme: this.language,
    })

    if (this.visible) {
      emitter.emit(`${this.language}.visible`, { editor: instance })
    }

    Editor.insertOrUpdate({
      data: [{
        id: this.editorId,
        instance,
      }],
    }).then(() => {
      this.loadEvents()
    })
    // .catch(err => {
    //   console.error(err)
    // })

    instance.layout({ width: this.width, height: this.height })
  },

  methods: {
    loadEvents () {
      this.editor.onDidBlurEditorText((...args) => this.blur(args))
      this.editor.onDidChangeModelContent((...args) => this.change(args))
      this.editor.onKeyDown((...args) => this.change(args))
      this.editor.onDidChangeCursorPosition((...args) => this.changeCursor(args))
    },

    blur () {
      const value = this.editor.getValue()

      this.$emit('blur', value)
    },

    change () {
      const value = this.editor.getValue()

      this.$emit('change', value)
    },

    changeCursor (...args) {
      this.$emit('changeCursor', args)
    },

    handleResize() {
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
        ],
      })

      // Hack: a way to identify the height including wrapped lines
      let selector = this.$refs.editor.querySelector('.overflow-guard .margin')
      if (this.linesAsHeight && selector) {
        this.editor.layout({ height: selector.clientHeight, width: this.width })
      }
    },
  },
}
</script>

<style scoped lang="scss">
.editor {
  // overflow-y: scroll;
  // height: calc(100%);
}
</style>
