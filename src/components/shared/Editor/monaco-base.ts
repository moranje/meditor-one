import * as monaco from 'monaco-editor';
// @ts-ignore: babel plugin
import status from './languages/status';
// @ts-ignore: babel plugin
import snippet from './languages/snippet';

interface Languages {
  [index: string]: Language;
  status: Language;
  snippet: Language;
}

interface Language {
  syntax?: any;
  theme?: any;
  keyboardActions?: any;
  completionItemProvider?: any;
  hoverProvider?: any;
  editorConfiguration?: any;
  languageConfiguration?: any;
}

interface EditorOptions {
  language: string;
}

const languages: Languages = { snippet, status };

Object.keys(languages).forEach(language => {
  let {
    syntax,
    theme,
    keyboardActions,
    completionItemProvider,
    hoverProvider,
    languageConfiguration
  } = languages[language];

  monaco.languages.register({ id: language });

  if (syntax) monaco.languages.setMonarchTokensProvider(language, syntax);
  if (theme) monaco.editor.defineTheme(language, theme);

  if (languageConfiguration) {
    monaco.languages.setLanguageConfiguration(language, languageConfiguration);
  }

  if (completionItemProvider) {
    monaco.languages.registerCompletionItemProvider(language, {
      provideCompletionItems: () => completionItemProvider
    });
  }
});

export function setup($el: any, options: EditorOptions) {
  let opts = options;

  if (
    options.language &&
    languages[options.language] &&
    languages[options.language].editorConfiguration
  ) {
    opts = Object.assign(
      languages[options.language].editorConfiguration,
      options
    );
  }

  return monaco.editor.create($el, opts);
}

export function instance(editor: any) {
  // Enrich editor with language features
}
