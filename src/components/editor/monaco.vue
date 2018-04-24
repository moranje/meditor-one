<template>
  <article id="editor" />
</template>

<script>
import monacoLoader from './monaco-loader';
import { mapGetters } from 'vuex';
import { first, keys } from 'lodash';
import { editor as editorSettings, statusSyntax, statusTheme } from './config';
import { SnippetList } from '@/components/editor/snippet';
import initActions from '@/components/editor/config/monaco-actions';

export default {
  name: 'M1Monaco',

  props: {
    value: {
      type: String,
      default: ''
    },

    version: {
      type: String,
      default: '0.12.0'
    },

    theme: {
      type: String,
      default: 'vs'
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
    },

    editorOptions() {
      return Object.assign({}, editorSettings, this.options, {
        value: this.value,
        language: this.language,
        theme: this.theme
      });
    },

    fileNames() {
      return this.files.map(file => {
        const folder = this.$store.getters.findFolder(
          '.key',
          first(keys(file.folder))
        );

        return {
          name: `${folder.name.toLowerCase()} ${file.name.toLowerCase()}`,
          value: file.value
        };
      });
    },

    mapCompletionItems() {
      return this.fileNames.map(file => {
        const snippet = new SnippetList(file.value, this.fileNames).serialize();

        return {
          label: file.name,
          insertText: { value: snippet },
          // insertText: snippet,
          kind: monaco.languages.CompletionItemKind.Snippet
        };
      });
    },

    ...mapGetters({
      folders: 'allFolders',
      files: 'allFiles'
    })
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

  beforeUpdate() {
    window.removeEventListener('resize', this.handleResize);
  },

  beforeDestroy() {
    if (this.completionProvider) this.completionProvider.dispose();
    if (this.editor) this.editor.dispose();

    window.removeEventListener('resize', this.handleResize);
  },

  methods: {
    fetchEditor() {
      monacoLoader.load(this.version, this.setupEditor);
    },

    setupEditor() {
      window.monaco.languages.register({ id: 'snippet' });
      window.monaco.languages.register({ id: 'status' });

      window.monaco.languages.setMonarchTokensProvider('status', statusSyntax);
      window.monaco.editor.defineTheme('statusTheme', statusTheme);

      this.createEditor(window.monaco);
    },

    createEditor(monaco) {
      this.editor = monaco.editor.create(this.$el, this.editorOptions);

      this.editorHasLoaded(monaco);
    },

    editorHasLoaded(monaco) {
      this.monaco = monaco;

      // Events
      this.editor.onDidBlurEditor((...args) => this.emitBeforeLeave(args));
      this.editor.onDidChangeModelContent((...args) => this.emitChange(args));
      this.editor.onKeyDown((...args) => this.emitChange(args));
      this.editor.onDidDispose((...args) => {}); // eslint-disable-line;

      // Keyboard shortcuts
      this.editor.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KEY_P, // eslint-disable-line
        (...args) =>
          this.editor.trigger('Command palette', 'editor.action.quickCommand')
      );
      initActions(monaco, this);

      // Completion items
      this.completionProvider = monaco.languages.registerCompletionItemProvider(
        'status',
        {
          provideCompletionItems: () => this.mapCompletionItems
        }
      );

      window.addEventListener('resize', this.handleResize);
      this.handleResize();
      this.editor.layout({ width: this.width, height: this.height });

      this.$emit('mounted', this.editor);
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

      this.$emit('before-leave', value);
    },

    emitChange() {
      const value = this.editor.getValue();

      this.$emit('change', value);
    }
  }
};
</script>

<style lang="scss">
@media print {
  .decorationsOverviewRuler {
    display: none;
  }
}
</style>
