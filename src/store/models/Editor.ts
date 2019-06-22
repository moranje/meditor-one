import { Model } from '@vuex-orm/core'
import MonacoSnippetController from '@/snippet-service/monaco-controller'

export default class Editor extends Model {
  static entity = 'editor'
  static primaryKey = 'id'

  instance: any
  id: string
  snippetMode: boolean
  snippetModeActionCommand: any
  lineNumber: number
  column: number
  controller: MonacoSnippetController

  static fields(): any {
    return {
      id: this.string(''),
      instance: this.attr(null),
      snippetMode: this.boolean(false),
      snippetModeActionCommand: this.attr(null),
      lineNumber: this.number(1),
      column: this.number(1),
      controller: this.attr(null),
    }
  }

  static afterUpdate(model: any) {
    if (model.snippetModeActionCommand && model.snippetMode) {
      model.snippetModeActionCommand.set(model.snippetMode)
    } else if (model.snippetModeActionCommand && !model.snippetMode) {
      model.snippetModeActionCommand.reset()
    }
  }
}
