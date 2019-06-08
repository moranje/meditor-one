import SnippetSession from '@/components/Shared/Editor/snippet/session'
import { SnippetParser } from '../parser'
import { stringify } from 'flatted/cjs'

describe('Unit: Session', () => {
  it('should create a session object', () => {
    const template = ''
    let snippet = new SnippetParser({}).parse(template).root
    let session = new SnippetSession(snippet)

    expect(session).toBeInstanceOf(SnippetSession)
  })

  it('should loop though tabstops', () => {
    const template = 'A snippet $1. It has $2 tabstops.'
    let snippet = new SnippetParser({}).parse(template).root
    let session = new SnippetSession(snippet)

    expect(session.next()).toEqual([
      {
        end: { column: 11, lineNumber: 1 },
        offsetEnd: 10,
        offsetStart: 10,
        start: { column: 11, lineNumber: 1 },
      },
    ])
    expect(session.next()).toEqual([
      {
        end: { column: 20, lineNumber: 1 },
        offsetEnd: 19,
        offsetStart: 19,
        start: { column: 20, lineNumber: 1 },
      },
    ])
    // Don't go beyond last marker
    expect(session.next()).toEqual([
      {
        end: { column: 20, lineNumber: 1 },
        offsetEnd: 19,
        offsetStart: 19,
        start: { column: 20, lineNumber: 1 },
      },
    ])
    // Go to previous marker
    expect(session.prev()).toEqual([
      {
        end: { column: 11, lineNumber: 1 },
        offsetEnd: 10,
        offsetStart: 10,
        start: { column: 11, lineNumber: 1 },
      },
    ])
    // Don't go beyond first marker
    expect(session.prev()).toEqual([
      {
        end: { column: 11, lineNumber: 1 },
        offsetEnd: 10,
        offsetStart: 10,
        start: { column: 11, lineNumber: 1 },
      },
    ])
  })

  it('should loop though tabstops with newlines', () => {
    const template = 'A snippet \n $1. It has \n $2 tabstops.'
    let snippet = new SnippetParser({}).parse(template).root
    let session = new SnippetSession(snippet)

    expect(session.next()).toEqual([
      {
        end: { column: 2, lineNumber: 2 },
        offsetEnd: 12,
        offsetStart: 12,
        start: { column: 2, lineNumber: 2 },
      },
    ])
    expect(session.next()).toEqual([
      {
        end: { column: 2, lineNumber: 3 },
        offsetEnd: 23,
        offsetStart: 23,
        start: { column: 2, lineNumber: 3 },
      },
    ])
    // Go to previouss marker
    expect(session.prev()).toEqual([
      {
        end: { column: 2, lineNumber: 2 },
        offsetEnd: 12,
        offsetStart: 12,
        start: { column: 2, lineNumber: 2 },
      },
    ])
  })

  it('should loop though tabstop groups', () => {
    const template = 'A snippet $1. It has $2 tabstops. Total: $2'
    let snippet = new SnippetParser({}).parse(template).root
    let session = new SnippetSession(snippet)

    expect(session.next()).toEqual([
      {
        end: { column: 11, lineNumber: 1 },
        offsetEnd: 10,
        offsetStart: 10,
        start: { column: 11, lineNumber: 1 },
      },
    ])
    expect(session.next()).toEqual([
      {
        end: { column: 20, lineNumber: 1 },
        offsetEnd: 19,
        offsetStart: 19,
        start: { column: 20, lineNumber: 1 },
      },
      {
        end: { column: 38, lineNumber: 1 },
        offsetEnd: 37,
        offsetStart: 37,
        start: { column: 38, lineNumber: 1 },
      },
    ])
    // Go to previouss marker
    expect(session.prev()).toEqual([
      {
        end: { column: 11, lineNumber: 1 },
        offsetEnd: 10,
        offsetStart: 10,
        start: { column: 11, lineNumber: 1 },
      },
    ])
  })

  it('should loop though placeholders with text content', () => {
    const template = 'A snippet ${1:sentence}. It has ${2:2} placeholders'
    let snippet = new SnippetParser({}).parse(template).root
    let session = new SnippetSession(snippet)

    expect(session.next()).toEqual([
      {
        end: { column: 19, lineNumber: 1 },
        offsetEnd: 18,
        offsetStart: 10,
        start: { column: 11, lineNumber: 1 },
      },
    ])
    expect(session.next()).toEqual([
      {
        end: { column: 29, lineNumber: 1 },
        offsetEnd: 28,
        offsetStart: 27,
        start: { column: 28, lineNumber: 1 },
      },
    ])
    // Go to previouss marker
    expect(session.prev()).toEqual([
      {
        end: { column: 19, lineNumber: 1 },
        offsetEnd: 18,
        offsetStart: 10,
        start: { column: 11, lineNumber: 1 },
      },
    ])
  })

  it('should loop though nested placeholders with text content', () => {
    const template = 'A snippet ${1:with nested ${2:content}}.'
    let snippet = new SnippetParser({}).parse(template).root
    let session = new SnippetSession(snippet)

    expect(session.next()).toEqual([
      {
        end: { column: 30, lineNumber: 1 },
        offsetEnd: 29,
        offsetStart: 10,
        start: { column: 11, lineNumber: 1 },
      },
    ])
    expect(session.next()).toEqual([
      {
        end: { column: 30, lineNumber: 1 },
        offsetEnd: 29,
        offsetStart: 22,
        start: { column: 23, lineNumber: 1 },
      },
    ])
    // Go to previouss marker
    expect(session.prev()).toEqual([
      {
        end: { column: 30, lineNumber: 1 },
        offsetEnd: 29,
        offsetStart: 10,
        start: { column: 11, lineNumber: 1 },
      },
    ])
  })

  it('should edit marker when user inserts text', () => {
    const template = 'A snippet $1.'
    let snippet = new SnippetParser({}).parse(template).root
    let session = new SnippetSession(snippet)

    // Go to first tabstop
    session.next()

    session.onTextChanged(10, 0, 'sample')

    expect(snippet.toText()).toBe('A snippet sample.')
  })

  it('should edit marker when user inserts a character inside a placeholder', () => {
    const template = 'A snippet ${1:samle}.'
    let snippet = new SnippetParser({}).parse(template).root
    let session = new SnippetSession(snippet)

    // Go to first tabstop
    session.next()

    session.onTextChanged(13, 0, 'p')

    expect(snippet.toText()).toBe('A snippet sample.')
  })

  it('should edit multiple markers when user inserts text', () => {
    const template = 'A snippet $1. And what a ${1:snippet} it is.'
    let snippet = new SnippetParser({}).parse(template).root
    let session = new SnippetSession(snippet)

    // Go to first tabstop
    session.next()

    session.onTextChanged(10, 0, 'sample')

    expect(snippet.toText()).toBe('A snippet sample. And what a sample it is.')
  })

  it('should update markers following a text update', () => {
    const template = 'A snippet $1. And what a $2 it is.'
    let snippet = new SnippetParser({}).parse(template).root
    let session = new SnippetSession(snippet)

    // Go to first tabstop
    session.next()

    session.onTextChanged(10, 0, 'sample')

    session.next()

    session.onTextChanged(10, 0, 'great sample')

    expect(snippet.toText()).toBe(
      'A snippet sample. And what a great sample it is.'
    )

    expect(`${snippet}`).toBe(
      'A snippet ${1:sample}. And what a ${2:great sample} it is.'
    )
  })

  it('should update markers following a text update with multiple inserts', () => {
    const template = 'A snippet $1. A new $1. And what a $2 it is.'
    let snippet = new SnippetParser({}).parse(template).root
    let session = new SnippetSession(snippet)

    // Go to first tabstop
    session.next()

    session.onTextChanged(10, 0, 'sample')

    session.next()

    session.onTextChanged(10, 0, 'great sample')

    expect(snippet.toText()).toBe(
      'A snippet sample. A new sample. And what a great sample it is.'
    )
  })

  it('should edit with zero-length strings on multiple markers', () => {
    const template = 'A snippet $1. And what a ${1:snippet} it is.'
    let snippet = new SnippetParser({}).parse(template).root
    let session = new SnippetSession(snippet)

    // Go to first tabstop
    session.next()

    session.onTextChanged(10, 0, '')

    expect(snippet.toText()).toBe('A snippet . And what a  it is.')
  })

  it('should remove text when the overwrite parameter is specified', () => {
    const template = 'A snippet ${1:snippet}. And another $1'
    let snippet = new SnippetParser({}).parse(template).root
    let session = new SnippetSession(snippet)

    // Go to first tabstop
    session.next()

    session.onTextChanged(10, 7)

    expect(snippet.toText()).toBe('A snippet . And another ')
  })

  it('should update placeholder groups when a choice element changes', () => {
    const template = 'Take the ${1|blue,red|} pill. And another $1 pill'
    let snippet = new SnippetParser({}).parse(template).root
    let session = new SnippetSession(snippet)

    // Go to first tabstop
    session.next()

    session.onTextChanged(9, 4, 'red')

    expect(snippet.toText()).toBe('Take the red pill. And another red pill')
  })
})
