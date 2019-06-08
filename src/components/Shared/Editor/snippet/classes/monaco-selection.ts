import Selection from './selection'

export default class MonacoSelection extends Selection {
  constructor(selection: Selection) {
    super(
      selection.start,
      selection.end,
      selection.offsetStart,
      selection.offsetEnd
    )
  }

  get range() {
    return {
      startColumn: this.start.column,
      startLineNumber: this.start.lineNumber,
      endColumn: this.end.column,
      endLineNumber: this.end.lineNumber,
    }
  }

  get selection() {
    return {
      selectionStartColumn: this.start.column,
      selectionStartLineNumber: this.start.lineNumber,
      positionColumn: this.end.column,
      positionLineNumber: this.end.lineNumber,
    }
  }
}
