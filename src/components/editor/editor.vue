<template>
  <div
    id="editor"
    class="editor"
  />
</template>

<script>
import * as monaco from '@timkendrick/monaco-editor';
import editorSettings from './editor-settings';

export default {
  name: '',

  props: {
    value: {
      type: String,
      default: ''
    },
    state: {
      type: Object,
      default: () => ({})
    },
    theme: {
      type: String,
      default: 'vs'
    },
    listenToStateChanges: {
      type: Boolean,
      default: false
    },
    language: {
      type: String,
      default: 'snippet'
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      editor: null,
      completionProvider: null
    };
  },

  computed: {
    height() {
      return this.$store.getters.getContentAreaSize('height');
    },

    width() {
      return this.$store.getters.getContentAreaSize('width');
    }
  },

  watch: {
    value(newValue) {
      if (this.editor) {
        if (newValue !== this.editor.getValue()) {
          this.editor.setValue(newValue);
        }
      }
    },

    state(model) {
      if (this.editor) {
        this.editor.setModel(model);
      }
    },

    height() {
      this.editor.layout({ height: this.height, width: this.width });
    },

    width() {
      this.editor.layout({ height: this.height, width: this.width });
    }
  },

  mounted() {
    const options = Object.assign(editorSettings, {
      value: this.value,
      theme: this.theme,
      language: this.language,
      ...this.options
    });

    monaco.languages.register({ id: 'snippet' });
    monaco.languages.register({ id: 'status' });

    this.editor = monaco.editor.create(
      document.getElementById('editor'),
      options
    );

    if (Object.keys(this.state).length > 0) {
      this.editor.restoreViewState(this.state);
    }

    // Events
    this.editor.onDidBlurEditor((...args) => this.emitBeforeLeave(args));
    this.editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S,
      (...args) => this.emitBeforeLeave(args)
    );
    this.editor.onDidChangeModelContent((...args) => this.emitChange(args));
    // this.editor.onDidFocusEditor(event => this.editor.layout());
    this.editor.onDidChangeCursorSelection(
      (...args) => null /* TODO: use to keep track of cursor position */
    );
    this.editor.onDidLayoutChange(
      (...args) => null
      /* TODO: use to debug layout changes */
    );
    this.editor.onDidFocusEditor((...args) => {
      // This set the initial value of the editor
      this.handleResize();
    });
    this.editor.onKeyDown((...args) => this.emitChange(args));
    this.editor.onDidDispose(
      (...args) => null /* TODO: proper cleanup, serialization */
    );

    this.completionProvider = monaco.languages.registerCompletionItemProvider(
      'status',
      {
        provideCompletionItems: (model, position) => [
          ...this.$store.getters.findAllFolderCompletions(
            monaco.languages.CompletionItemKind.Snippet
          ),
          ...this.$store.getters.findAllFileCompletions(
            monaco.languages.CompletionItemKind.Snippet
          )
        ]
      }
    );

    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    this.editor.layout({
      width: this.width,
      height: this.height
    });
  },

  beforeDestroy() {
    this.editor.dispose();
    this.completionProvider.dispose();
    this.editor = null;
    this.completionProvider = null;
    window.removeEventListener('resize', this.handleResize);
  },

  methods: {
    getEditor() {
      return this.editor;
    },

    handleResize() {
      const viewportHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      );
      const viewportWidth = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      );
      const handleWidth = 10;
      const navbarFooterHeight = 64 + 36;
      const sidebarWidth = this.$store.getters.getSidebarWidth();

      this.$store.commit('setContentAreaSize', {
        height: viewportHeight - navbarFooterHeight,
        width: viewportWidth - (sidebarWidth + handleWidth)
      });
    },

    emitBeforeLeave() {
      const value = this.editor.getValue();
      const state = this.editor.getModel();

      this.$emit('before-leave', value);
      this.$emit('before-leave-state', state);
    },

    emitChange() {
      const value = this.editor.getValue();
      const state = this.editor.getModel();

      this.$emit('change', value);
      this.$emit('change-state', state);
    }
  }
};
</script>
