<template>
  <div id="editor" />
</template>

<script>
import * as monaco from '@timkendrick/monaco-editor';
// import * as monaco from 'monaco-editor';
import { mapGetters } from 'vuex';
import { first, keys } from 'lodash';
import parse from './parser';
import editorSettings from './editor-settings';

export default {
  name: 'M1Monaco',

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
        const snippet = parse(file.value).compile(this.fileNames);

        return {
          label: file.name,
          insertText: { value: snippet },
          // insertText: snippet,
          kind: monaco.languages.CompletionItemKind.Snippet
        };
      });
    },

    // pruneFolders() {
    //   let duplicates = false;
    //   this.folders.forEach(folder => {
    //     keys(folder.folder).forEach(folderId => {
    //       let folderCheck = this.$store.getters.findFolder('.key', folderId);

    //       if (keys(folderCheck).length === 0) {
    //         duplicates = true;
    //         console.log(
    //           'Prune',
    //           `Parent folder ${folder['.key']} with folder child ${folderId}`
    //         );
    //       }
    //     });
    //   });

    //   this.files.forEach(file => {
    //     keys(file.folder).forEach(folderId => {
    //       let folderCheck = this.$store.getters.findFolder('.key', folderId);

    //       if (keys(folderCheck).length === 0) {
    //         duplicates = true;
    //         console.log(
    //           'Prune',
    //           `Parent file ${file['.key']} with folder child ${folderId}`
    //         );
    //       }
    //     });
    //   });

    //   return duplicates;
    // },

    ...mapGetters({
      folders: 'allFolders',
      files: 'allFiles'
    })
  },

  watch: {
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
    const options = Object.assign(editorSettings, {
      value: this.value,
      theme: this.theme,
      language: this.language,
      ...this.options
    });

    let head = [
      'Reden van komst',
      'Reden van consult',
      'Ambulance',
      'Voorgeschiedenis',
      'Medicatie',
      'Intoxicaties',
      'Anamnese',
      'Heteroanamnese',
      'Neurologisch onderzoek',
      'Lichamelijk onderzoek',
      'Primary survey volgens ATLS',
      'Primary survey',
      'Secondary survey',
      'Aanvullend onderzoek',
      'Conclusie',
      'Beleid'
    ];
    let emph = [
      'Algemeen',
      'Vitaal',
      'Hoofd/hals',
      'Thorax',
      'Hart',
      'Cor',
      'Longen',
      'Pulmones',
      'Abdomen',
      'Extremiteiten',
      'Bovenste extremiteiten',
      'Onderste extremiteiten',
      'Vaginaal toucher',
      'Rectaal toucher',
      'Lab',
      'X-thorax',
      'X-bekken',
      'ECG',
      'Used',
      'Urinesediment',
      'Fluordiagnostiek',
      'Bloedkweek',
      'CT-hersenen',
      'CT-CWK',
      'CT-total body',
      'Bloedgas',
      'Familie',
      'Sociaal',
      'A',
      'B',
      'C',
      'D',
      'E',
      'M',
      'I',
      'S',
      'T',
      'P',
      'L',
      'HZ',
      'R'
    ];
    // const space = /(\s\s+|\s,)/;
    const headings = new RegExp('^\\b(' + head.join('|') + ')\\b$');
    const emphasized = new RegExp('^(' + emph.join('|') + ')(:|/)');

    monaco.languages.register({ id: 'snippet' });
    monaco.languages.register({ id: 'status' });
    monaco.languages.setMonarchTokensProvider('status', {
      tokenizer: {
        root: [
          [headings, 'headings'],
          [emphasized, 'emphasized']
          // [space, 'space']
        ]
      }
    });

    monaco.editor.defineTheme('statusTheme', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'headings', fontStyle: 'bold' },
        // { token: 'important', foreground: 'ff0000' },
        // { token: 'changed', foreground: 'FFA500' },
        { token: 'emphasized', fontStyle: 'italic' },
        { token: 'space', background: '777777' }
      ]
    });

    this.editor = monaco.editor.create(
      document.getElementById('editor'),
      options
    );

    // Events
    this.editor.onDidBlurEditor((...args) => this.emitBeforeLeave(args));
    this.editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, // eslint-disable-line
      (...args) => this.emitBeforeLeave(args)
    );
    this.editor.onDidChangeModelContent((...args) => this.emitChange(args));
    // this.editor.onDidFocusEditor(event => this.editor.layout());
    this.editor.onDidChangeCursorSelection(
      (...args) => null // eslint-disable-line
    );
    this.editor.onDidLayoutChange(
      (...args) => null // eslint-disable-line
      /* TODO: use to debug layout changes */
    );
    // eslint-disable-next-line
    this.editor.onDidFocusEditor((...args) => {
      // This set the initial value of the editor
      this.handleResize();
    });
    this.editor.onKeyDown((...args) => this.emitChange(args));
    this.editor.onDidDispose(
      (...args) => null // eslint-disable-line
    );

    this.completionProvider = monaco.languages.registerCompletionItemProvider(
      'status',
      {
        provideCompletionItems: () => this.mapCompletionItems
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
