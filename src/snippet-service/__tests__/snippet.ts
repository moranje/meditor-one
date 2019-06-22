import { SnippetParser } from '@/snippet-service/parser'
import Expansion from '../classes/expansion'
import context from './context.stub'

function parse(input) {
  return () => {
    let snippet = new SnippetParser({}).parse(input).root

    expect(`${snippet}`).toBe(input)
  }
}

describe('Unit: Snippet', () => {
  it('should return the selection for a single text node', () => {
    const input = 'This is a text node'
    let snippet = new SnippetParser({}).parse(input).root
    let marker = snippet.children[0]

    expect(snippet.selection(marker)).toEqual({
      end: { column: 20, lineNumber: 1 },
      offsetEnd: 19,
      offsetStart: 0,
      start: { column: 1, lineNumber: 1 },
    })
  })

  it('should return the selection for a tabstop inside text', () => {
    const input = 'This is $1 text node'
    let snippet = new SnippetParser({}).parse(input).root
    let marker = snippet.children[1]

    expect(snippet.selection(marker)).toEqual({
      end: { column: 9, lineNumber: 1 },
      offsetEnd: 8,
      offsetStart: 8,
      start: { column: 9, lineNumber: 1 },
    })
  })

  it('should return the selection for a text node following a tabstop', () => {
    const input = 'This is $1 text node'
    let snippet = new SnippetParser({}).parse(input).root
    let marker = snippet.children[2]

    expect(snippet.selection(marker)).toEqual({
      end: { column: 19, lineNumber: 1 },
      offsetEnd: 18,
      offsetStart: 8,
      start: { column: 9, lineNumber: 1 },
    })
  })

  it('should return the selection for a placeholder node', () => {
    const input = 'This is ${1:placeholder} text node'
    let snippet = new SnippetParser({}).parse(input).root
    let marker = snippet.children[1]

    expect(snippet.selection(marker)).toEqual({
      end: { column: 20, lineNumber: 1 },
      offsetEnd: 19,
      offsetStart: 8,
      start: { column: 9, lineNumber: 1 },
    })
  })

  it('should return the selection for a nesting placeholder', () => {
    const input = 'This is ${1:a nested $2} text node'
    let snippet = new SnippetParser({}).parse(input).root
    let marker = snippet.children[1]

    expect(snippet.selection(marker)).toEqual({
      end: { column: 18, lineNumber: 1 },
      offsetEnd: 17,
      offsetStart: 8,
      start: { column: 9, lineNumber: 1 },
    })
  })

  it('should return the selection for a nested placeholder', () => {
    const input = 'This is ${1:a nested\n $2} text node'
    let snippet = new SnippetParser({}).parse(input).root
    let marker = snippet.children[1].children[0].children[1] // $2

    expect(snippet.selection(marker)).toEqual({
      end: { column: 2, lineNumber: 2 },
      offsetEnd: 18,
      offsetStart: 18,
      start: { column: 2, lineNumber: 2 },
    })
  })

  it('should return the selection for a choice', () => {
    const input = 'This is a ${1|choice,placeholder,text|}'
    let snippet = new SnippetParser({}).parse(input).root
    let marker = snippet.children[1]

    expect(snippet.selection(marker)).toEqual({
      end: { column: 17, lineNumber: 1 },
      offsetEnd: 16,
      offsetStart: 10,
      start: { column: 11, lineNumber: 1 },
    })
  })

  it('should return the selection for a choice with empty first option', () => {
    const input = 'This is a ${1|,placeholder,text|}'
    let snippet = new SnippetParser({}).parse(input).root
    let marker = snippet.children[1]

    expect(snippet.selection(marker)).toEqual({
      end: { column: 11, lineNumber: 1 },
      offsetEnd: 10,
      offsetStart: 10,
      start: { column: 11, lineNumber: 1 },
    })
  })

  it('should return the selection for a choice with expansion choice option', () => {
    const input = 'This is a ${1|${!2:expansion-snippet},placeholder,text|}'
    let snippet = new SnippetParser({}).parse(input).root
    let marker = snippet.children[1]

    expect(snippet.selection(marker)).toEqual({
      end: { column: 11, lineNumber: 1 },
      offsetEnd: 10,
      offsetStart: 10,
      start: { column: 11, lineNumber: 1 },
    })
  })

  it('should return the selection for entire expansion', () => {
    const input = '${!1:basic}'
    let snippet = new SnippetParser(context).parse(input).root
    let marker = snippet.children[0]

    expect(snippet.selection(marker)).toEqual({
      end: { column: 21, lineNumber: 1 },
      offsetEnd: 20,
      offsetStart: 0,
      start: { column: 1, lineNumber: 1 },
    })
  })

  it('should return the selection for a nested placeholder inside expansion', () => {
    // 'Tabstop: $1. 2nd Level: $3. $Final level: $5. And $4. Tabstop: $2.'
    const input = '${!1:first-nested}'
    let snippet = new SnippetParser(context).parse(input).root
    let marker = snippet.children[0].children[1]

    expect(snippet.selection(marker)).toEqual({
      end: { column: 10, lineNumber: 1 },
      offsetEnd: 9,
      offsetStart: 9,
      start: { column: 10, lineNumber: 1 },
    })
  })

  it('should return a selection for a nested choice element when the first element is a string (> 0 chars)', () => {
    const input = '${!1:nested-choice}'
    let snippet = new SnippetParser(context).parse(input).root
    let marker = snippet.children[0].children[0].children[0]

    expect(snippet.selection(marker)).toEqual({
      end: { column: 4, lineNumber: 1 },
      offsetEnd: 3,
      offsetStart: 0,
      start: { column: 1, lineNumber: 1 },
    })
  })

  it('should return a selection for a placeholder after a nested choice element', () => {
    const input = '${!1:nested-choice} $2'
    let snippet = new SnippetParser(context).parse(input).root
    let marker = snippet.children[2]

    expect(snippet.selection(marker)).toEqual({
      end: { column: 5, lineNumber: 1 },
      offsetEnd: 4,
      offsetStart: 4,
      start: { column: 5, lineNumber: 1 },
    })
  })
})
