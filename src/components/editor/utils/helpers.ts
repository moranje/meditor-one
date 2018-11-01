export function createEditor(monaco, language, $el, options) {
  monaco.languages.register({ id: language });

  return Promise.all([
    import(`@/components/editor/languages/${language}/syntax`),
    import(`@/components/editor/languages/${language}/theme`),
    import(`@/components/editor/languages/${language}/language-configuration`),
    import(`@/components/editor/languages/${language}/editor-configuration`),
    import(`@/components/editor/languages/${language}/keyboard-actions`)
  ]).then(([syntax, theme, languageConfig, editorConfig, keyboardActions]) => {
    monaco.editor.defineTheme(language, theme);
    monaco.languages.setMonarchTokensProvider(language, syntax);
    monaco.languages.setLanguageConfiguration(language, languageConfig);
    monaco.languages.registerCompletionItemProvider(language, {
      provideCompletionItems: () => {
        return options.completionItemProvider || (() => {});
      }
    });
    monaco.languages.registerHoverProvider(language, {
      provideHover: () => options.hoverProvider || (() => {})
    });

    let editor = monaco.editor.create($el, editorConfig);

    createKeyboardActions(monaco, editor, keyboardActions);

    return editor;
  });
}

// TODO: removeEditor() => clear editor

export function createKeyboardActions(
  monaco,
  editor,
  keyboardActions: {
    addActions: (monaco, editor) => any[];
    addCommands: (monaco, editor) => any[];
  }
) {
  keyboardActions.addActions(monaco, editor).forEach(action => {
    editor.addAction(action);
  });

  keyboardActions.addCommands(monaco, editor).forEach(command => {
    editor.addCommand(command.keys, command.action);
  });
}
