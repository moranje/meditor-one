<template>
  <article />
</template>

<script>
import monacoLoader from './monaco-loader';
import editorSettings from './editor-settings';

export default {
  name: 'M1Monaco',

  props: {
    value: {
      type: String,
      default: ''
    },

    srcPath: {
      type: String,
      default: ''
    },

    language: {
      type: String,
      default: 'snippet'
    },

    theme: {
      type: String,
      default: 'vs'
    },

    options: {
      type: Object,
      default: () => {}
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
    },

    editorOptions() {
      return Object.assign({}, editorSettings, this.options, {
        value: this.code,
        language: this.language,
        theme: this.theme
      });
    }
  },

  watch: {
    language() {
      window.monaco.editor.setModelLanguage(
        this.editor.getModel(),
        this.language
      );
    },

    value(newValue) {
      if (this.editor) {
        if (newValue !== this.editor.getValue()) {
          this.editor.setValue(newValue);
        }
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
    this.fetchEditor();
  },

  destroyed() {
    this.destroyMonaco();
  },

  methods: {
    editorHasLoaded(editor, monaco) {
      this.editor = editor;
      this.monaco = monaco;

      // Languages
      this.registerLanguages(monaco);

      // Events
      this.editor.onDidBlurEditor((...args) => this.emitBeforeLeave(args));
      this.editor.onDidChangeModelContent((...args) => this.emitChange(args));
      this.editor.onKeyDown((...args) => this.emitChange(args));

      // Keyboard shortcuts
      this.editor.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, // eslint-disable-line
        (...args) => this.emitBeforeLeave(args)
      );

      // Completion items
      this.completionProvider = monaco.languages.registerCompletionItemProvider(
        'status',
        { provideCompletionItems: this.provideCompletionItems(monaco) }
      );

      window.addEventListener('resize', this.handleResize);
      this.handleResize();
      this.editor.layout({ width: this.width, height: this.height });

      this.$emit('mounted', editor);
    },

    fetchEditor() {
      monacoLoader.load(this.srcPath, this.createMonaco);
    },

    createMonaco() {
      this.editor = window.monaco.editor.create(this.$el, this.editorOptions);
      this.editorHasLoaded(this.editor, window.monaco);
    },

    registerLanguages(monaco) {
      monaco.languages.register({ id: 'snippet' });
      monaco.languages.register({ id: 'status' });
    },

    provideCompletionItems(monaco) {
      return () =>
        this.$store.getters.findAllFolderCompletions(
          monaco.languages.CompletionItemKind.Snippet
        );
    },

    destroyMonaco() {
      if (typeof this.editor !== 'undefined') {
        this.editor.dispose();
        this.completionProvider.dispose();
      }

      window.removeEventListener('resize', this.handleResize);
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
    }
  }
};
</script>
