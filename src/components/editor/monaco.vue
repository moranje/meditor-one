<template>
  <article id="editor" />
</template>

<script>
import * as monaco from 'monaco-editor';
import { mapGetters } from 'vuex';
import { first, keys } from 'lodash';
import {
  editor as editorSettings,
  statusSyntax,
  statusTheme,
  snippetSyntax,
  snippetTheme
} from './config';
import { SnippetList } from '@/components/editor/snippet';
import { parse, validate } from '@/utils/snippet-tree';
import initActions from '@/components/editor/config/monaco-actions';
import functions from '@/components/editor/config/functions';

export default {
  name: 'M1Monaco',

  props: {
    value: {
      type: String,
      default: ''
    },

    // TODO: delete once createEditor method is working
    theme: {
      type: String,
      default: 'vs'
    },

    // TODO: delete once createEditor method is working
    language: {
      type: String,
      default: 'snippet'
    },

    // TODO: delete once createEditor method is working
    options: {
      type: Object,
      default: () => ({})
    },

    completionItemProvider: {
      type: Function,
      default: () => ({})
    },

    hoverProvider: {
      type: Function,
      default: () => ({})
    }
  },

  // TODO: delete once createEditor method is working
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
        let snippet;

        try {
          snippet = `${parse(file.value, {
            // NOTE: very expensive filter
            snippets: this.fileNames.filter(
              snippetReference => snippetReference.name !== file.name
            ),
            functions
          })}`;
        } catch (err) {
          console.error(err, file);
          snippet = '';
        }

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
      monaco.editor.setModelLanguage(this.editor.getModel(), this.language);
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
    this.setupEditor();
    //createEditor(monaco, this.language, this.$el, this.options).then(editor => this.editor).catch(err => throw err);
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
    setupEditor() {
      monaco.languages.register({ id: 'snippet' });
      monaco.languages.register({ id: 'status' });

      monaco.languages.setMonarchTokensProvider('status', statusSyntax);
      monaco.editor.defineTheme('statusTheme', statusTheme);
      monaco.languages.setMonarchTokensProvider('snippet', snippetSyntax);
      monaco.editor.defineTheme('snippetTheme', snippetTheme);
      monaco.languages.setLanguageConfiguration('snippet', {
        brackets: [['${', '}']]
      });

      this.editor = monaco.editor.create(this.$el, this.editorOptions);

      this.editorHasLoaded(monaco);
    },

    editorHasLoaded(monaco) {
      // Events
      this.editor.onDidBlurEditorText((...args) => this.emitBeforeLeave(args));
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

      if (this.language === 'snippet') {
        this.validate(value);
      }
      this.$emit('before-leave', value);
    },

    emitChange() {
      const value = this.editor.getValue();

      if (this.language === 'snippet') {
        this.validate(value);
      }
      this.$emit('change', value);
    },

    validate(value) {
      // Markers
      monaco.editor.setModelMarkers(
        this.editor.getModel(),
        'linter',
        validate(value, { snippets: this.fileNames })
      );
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
