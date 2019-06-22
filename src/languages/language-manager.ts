import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

export interface EditorProvider {
  init(language: string, editor: monaco.editor.IStandaloneCodeEditor): void
  change(
    language: string,
    editor: monaco.editor.IStandaloneCodeEditor,
    args: any[]
  ): void
  destroy(editor: monaco.editor.IStandaloneCodeEditor): void
}

let listeners = {}
function errorHandler(err) {
  console.log(err)
}

export async function setup(
  language: string,
  $el: HTMLElement,
  options?: monaco.editor.IEditorConstructionOptions
) {
  await import(`@/languages/${language}/editor-theme`).catch(errorHandler)
  await import(`@/languages/${language}/language-configuration`).catch(
    errorHandler
  )
  await import(`@/languages/${language}/language-syntax`).catch(errorHandler)
  await import(`@/languages/${language}/language`).catch(errorHandler)
  const actions: { default: EditorProvider } = await import(
    `@/languages/${language}/code-actions`
  ).catch(errorHandler)
  const completions: { default: EditorProvider } = await import(
    `@/languages/${language}/completion-item-provider`
  ).catch(errorHandler)
  const config = await import(
    `@/languages/${language}/editor-configuration`
  ).catch(errorHandler)
  const lenses: { default: EditorProvider } = await import(
    `@/languages/${language}/code-lenses`
  ).catch(errorHandler)

  let editor: monaco.editor.IStandaloneCodeEditor = monaco.editor.create(
    $el,
    Object.assign(config.default, options)
  )

  // Initializers
  actions.default.init(language, editor)
  completions.default.init(language, editor)
  lenses.default.init(language, editor)

  // Dynamic initializers
  if (listeners[language]) listeners[language].dispose()
  listeners[language] = editor.onDidChangeModelContent((...args) => {
    actions.default.change(language, editor, args)
    completions.default.change(language, editor, args)
    lenses.default.change(language, editor, args)
  })

  return editor
}

export async function teardown(
  language,
  editor: monaco.editor.IStandaloneCodeEditor
) {
  const actions: { default: EditorProvider } = await import(
    `@/languages/${language}/code-actions`
  ).catch(errorHandler)
  const completions: { default: EditorProvider } = await import(
    `@/languages/${language}/completion-item-provider`
  ).catch(errorHandler)
  const lenses: { default: EditorProvider } = await import(
    `@/languages/${language}/code-lenses`
  ).catch(errorHandler)

  // Editor provider clean-up
  actions.default.destroy(editor)
  completions.default.destroy(editor)
  lenses.default.destroy(editor)

  // Destroy change listeners
  listeners[language].dispose()

  // Finally destroy the editor instance
  editor.dispose()
}
