<template lang="html">
  <VLayout ref="editorContainer" fill-height align-center justify-center>
    <VFlex v-show="!visible" xs6 sm4 md2>
      <VProgressCircular :size="70" :width="7" color="primary" indeterminate />
    </VFlex>
    <article ref="editor" v-show="visible" class="editor" />
  </VLayout>
</template>

<script lang="js">
// import { setup } from './monaco-base'
import { setup, teardown } from '@/languages/language-manager'
import Editor from '@/store/models/Editor'
import { emitter } from '@/components/Shared/emitter'
import uniqid from 'uniqid'
import wrap from 'wrap-ansi'

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

  data: () => ({
    listeners: [],
  }),

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

    width () {
      if (this.$store.getters.main) return this.$store.getters.main.width

      return 0
    },

    height () {
      if (this.$store.getters.main) return this.$store.getters.main.height

      return 0
    },
  },

  watch: {
    value (value) {
      if (this.editor && this.editor && value) {
        let val = this.value || this.editor.getValue()

        if (val !== value) this.editor.setValue(value)
      }
    },

    width(width) {
      this.setEditorDimensions({ height: this.height, width })
    },

    height(height) {
      this.setEditorDimensions({ height, width: this.width })
    },

    visible (isVisible) {
      emitter.emit(`${this.language}.visible`, { editor: this.editor })
    },
  },

  async mounted () {
    let instance = await setup(this.language, this.$refs.editor, {
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
      this.setEditorDimensions()
      this.loadEvents()
    })
      .catch(err => {
        console.error(err)
      })
  },

  async beforeDestroy() {
    this.unloadEvents()
    await teardown(this.language, this.editor).catch(err => console.log(err))
  },

  methods: {
    loadEvents () {
      this.listeners.push(
        this.editor.onDidBlurEditorText((...args) => this.blur(args)),
        this.editor.onDidChangeModelContent((...args) => this.change(args)),
        this.editor.onKeyDown((...args) => this.change(args)),
      // this.editor.onDidChangeCursorPosition((...args) => this.changeCursor(args)),
      // this.editor.onDidLayoutChange((...args) => this.setEditorDimensions(args)),
      )
    },

    unloadEvents() {
      this.listeners.forEach(listener => listener.dispose())

      this.listeners = []
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

    setEditorDimensions(dimensions) {
      if (!this.editor) return

      if (this.linesAsHeight) {
        // Calculate line height based on input value
        let height = wrap(this.value, 100, {
          wordWrap: true,
          trim: true,
        }).split('\n').length * 20
        this.editor.layout({ height, width: this.width })
      } else if (dimensions) {
        this.editor.layout(dimensions)
      } else {
        this.editor.layout({ width: this.width, height: this.height })
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
