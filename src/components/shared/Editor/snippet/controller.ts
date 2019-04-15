interface SnippetController {
  constructor(_editor: any)

  // insert(template: string, adjustWhitespace: boolean): SnippetSession
  finish(): void
  cancel(): void
  prev(): void
  next(): void
}
