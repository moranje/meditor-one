interface Position {
  column: number
  lineNumber: number
}

export default class Selection {
  constructor(
    public start: Position,
    public end: Position,
    public offsetStart: number,
    public offsetEnd: number
  ) {
    if (start.column < 1) {
      throw new Error(
        `Column starting postion must be a positive integer, was ${start.column}`
      )
    }

    if (start.lineNumber < 1) {
      throw new Error(
        `Line number starting postion must be a positive integer, was ${start.lineNumber}`
      )
    }

    if (end.column < 1) {
      throw new Error(
        `Column ending postion must be a positive integer, was ${end.column}`
      )
    }

    if (end.lineNumber < 1) {
      throw new Error(
        `Line number ending postion must be a positive integer, was ${end.lineNumber}`
      )
    }

    if (offsetStart < 0) {
      throw new Error(
        `Offset starting postion must be a positive integer, was ${offsetStart}`
      )
    }

    if (offsetEnd < 0) {
      throw new Error(
        `Offset ending postion must be a positive integer, was ${offsetEnd}`
      )
    }
  }

  get length(): number {
    return this.offsetEnd - this.offsetStart
  }

  isEmpty() {
    return (
      this.start.lineNumber === this.end.lineNumber &&
      this.start.column === this.end.column
    )
  }

  slice(string: string) {
    return string.substring(this.offsetStart, this.offsetEnd)
  }
}
