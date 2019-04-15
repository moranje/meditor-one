import { flatMap } from 'lodash-es'
import uniqid from 'uniqid'

function strip(node) {
  return {
    type: node.type,
    value: node.value,
    toString() {
      return `${node}`
    }
  }
}

function emptyChoice() {
  return {
    type: 'Text',
    id: uniqid(),
    value: `\u200B`,
    toString() {
      return `${this.value}`
    }
  }
}

function replacement([tokens]) {
  if (tokens[0] && tokens[1] && tokens[0].type === 'dollar') {
    return {
      type: 'Group',
      int: tokens[1].value,
      block: false,
      toString() {
        return `$${this.int}`
      }
    }
  }

  if (
    tokens[0] &&
    tokens[1] &&
    tokens[2] &&
    tokens[0].type === 'open' &&
    tokens[2].type === 'close'
  ) {
    return {
      type: 'Group',
      int: tokens[1].value,
      block: true,
      toString() {
        return `\${${this.int}}`
      }
    }
  }

  if (tokens[1] && tokens[3] && tokens[3].type === 'caseModifier') {
    return {
      type: 'CaseModifier',
      int: tokens[1].value,
      name: tokens[3].value.slice(1),
      toString() {
        return `\${${this.int}:/${this.name}}`
      }
    }
  }

  if (tokens[1] && tokens[3] && tokens[4] && tokens[3].type === 'plus') {
    return {
      type: 'If',
      int: tokens[1].value,
      ifCondition: tokens[4].value,
      toString() {
        return `\${${this.int}:+${this.ifCondition}}`
      }
    }
  }

  if (
    tokens[1] &&
    tokens[3] &&
    tokens[4] &&
    tokens[6] &&
    tokens[3].type === 'questionmark'
  ) {
    return {
      type: 'IfElse',
      int: tokens[1].value,
      ifCondition: tokens[4].value,
      elseCondition: tokens[6].value,
      toString() {
        return `\${${this.int}:?${this.ifCondition}:${this.elseCondition}}`
      }
    }
  }

  if (tokens[1] && tokens[3] && tokens[4] && tokens[3].type === 'minus') {
    return {
      type: 'Else',
      int: tokens[1].value,
      elseCondition: tokens[4].value,
      short: false,
      toString() {
        return `\${${this.int}:-${this.elseCondition}}`
      }
    }
  }

  if (
    tokens[1] &&
    tokens[3] === null &&
    tokens[4] &&
    tokens[4].type === 'condition'
  ) {
    return {
      type: 'Else',
      int: tokens[1].value,
      elseCondition: tokens[4].value,
      short: true,
      toString() {
        return `\${${this.int}:-${this.elseCondition}}`
      }
    }
  }

  if (tokens[0] && tokens[0].value) {
    return {
      type: 'ReplacementText',
      value: tokens[0].value,
      toString() {
        return `${this.value}`
      }
    }
  }

  throw new Error(`Unknown replacement tokens (${tokens})`)
}

// *********************************
// * Main functions
// *********************************

export function snippet([first, rest]) {
  return {
    type: 'Snippet',
    id: uniqid(),
    // Filter: logic to remove empty text nodes
    body: [first, ...[].concat(...rest)].filter(element => element),
    toString() {
      return this.body.join('')
    }
  }
}

export function comment([comment]) {
  return {
    type: 'Comment',
    id: uniqid(),
    value: comment.value,
    toComment() {
      return `#${this.value}`
    },
    toString() {
      // Don't return comments
      return ''
    }
  }
}

export function textPartial([text]) {
  let first = text[0]
  let last = text[text.length - 1]

  if (!first) {
    return null
  }

  return {
    type: 'Text',
    id: uniqid(),
    value: text.map(partial => partial.value).join(''),
    toString() {
      return `${this.value}`
    }
  }
}

export function escaped([escaped]) {
  // Unescape token, offsets the offset and col by 1
  return Object.assign(escaped, {
    value: escaped.value.charAt(1)
  })
}

export const tabstop = {
  simple: tabstopSimple,
  block: tabstopBlock,
  anchor: tabstopAnchor,
  incrementor: tabstopIncrementor,
  blockAnchor: tabstopBlockAnchor,
  blockIncrementor: tabstopBlockIncrementor,
  transform: tabstopTransform,
  rules: {
    noIncrementorInteger: tabstopNoIncrementorInteger
  }
}

export const placeholder = {
  simple: placeholderSimple,
  anchor: placeholderAnchor,
  incrementor: placeholderIncrementor,
  rules: {
    noIncrementorInteger: placeholderNoIncrementorInteger
  }
}

export const choice = {
  simple: choiceSimple,
  anchor: choiceAnchor,
  incrementor: choiceIncrementor,
  rules: {
    noIncrementorInteger: choiceNoIncrementorInteger
  }
}

export const variable = {
  simple: variableSimple,
  block: variableBlock,
  placeholder: variablePlaceholder,
  transform: variableTransform
}

export function tabstopSimple([dollar, int]) {
  return {
    type: 'Tabstop',
    id: uniqid(),
    modifier: null,
    int: int,
    block: false,
    toString() {
      return `$${this.int}`
    }
  }
}

export function tabstopAnchor([dollar, equals, int]) {
  return {
    type: 'Tabstop',
    id: uniqid(),
    modifier: equals.value,
    int: int.value,
    block: false,
    toString() {
      return `$=${this.int}`
    }
  }
}

export function tabstopIncrementor([dollar, plus]) {
  return {
    type: 'Tabstop',
    id: uniqid(),
    modifier: plus.value,
    int: null,
    block: false,
    toString() {
      return '$+'
    }
  }
}

export function tabstopBlock([open, int, close]) {
  return {
    type: 'Tabstop',
    id: uniqid(),
    modifier: null,
    int: int.value,
    block: true,
    toString() {
      return `\${${this.int}}`
    }
  }
}

export function tabstopBlockAnchor([open, equals, int, close]) {
  return {
    type: 'Tabstop',
    id: uniqid(),
    modifier: equals.value,
    int: int.value,
    block: true,
    toString() {
      return `\${=${this.int}}`
    }
  }
}

export function tabstopBlockIncrementor([open, plus, close]) {
  return {
    type: 'Tabstop',
    id: uniqid(),
    modifier: plus.value,
    int: null,
    block: true,
    toString() {
      return '${+}'
    }
  }
}

export function tabstopTransform([open, int, transform, close]) {
  let slash = {
    type: 'slash',
    value: '/',
    toString() {
      return '/'
    }
  }

  return {
    type: 'Transform',
    id: uniqid(),
    subtype: 'Tabstop',
    reference: int.value,
    pattern: transform.pattern,
    replacement: transform.replacement,
    flags: transform.flags,
    toString() {
      return `\${${this.reference}/${this.pattern}/${this.replacement.join(
        ''
      )}/${this.flags || ''}}`
    }
  }
}

// RULES

export function tabstopNoIncrementorInteger([dollar, plus, int]) {
  return {
    type: 'Tabstop',
    id: uniqid(),
    modifier: plus.value,
    int: null,
    block: false,
    toString() {
      return '$+'
    }
  }
}

// *********************************
// * Helper: Placeholder
// *********************************

export function placeholderSimple([open, int, colon, snippet, close]) {
  return {
    type: 'Placeholder',
    id: uniqid(),
    modifier: null,
    int: int.value,
    // Plcaholders don't have their own scope so the body element inherits
    // just it's children
    body: [
      strip(open),
      strip(int),
      strip(colon),
      ...snippet.body,
      strip(close)
    ],
    toString() {
      return this.body.join('')
    }
  }
}

export function placeholderAnchor([open, equals, int, colon, snippet, close]) {
  return {
    type: 'Placeholder',
    id: uniqid(),
    modifier: equals.value,
    int: int.value,
    // Plcaholders don't have their own scope so the body element inherits
    // just the snippets children
    body: [
      strip(open),
      strip(equals),
      strip(int),
      strip(colon),
      ...snippet.body,
      strip(close)
    ],
    toString() {
      return this.body.join('')
    }
  }
}

export function placeholderIncrementor([open, plus, colon, snippet, close]) {
  return {
    type: 'Placeholder',
    id: uniqid(),
    modifier: plus.value,
    int: null,
    // Plcaholders don't have their own scope so the body element inherits
    // just the snippets children
    body: [
      strip(open),
      strip(plus),
      strip(colon),
      ...snippet.body,
      strip(close)
    ],
    toString() {
      return this.body.join('')
    }
  }
}

// RULES

export function placeholderNoIncrementorInteger([
  open,
  plus,
  int,
  colon,
  snippet,
  close
]) {
  return {
    type: 'Placeholder',
    id: uniqid(),
    modifier: plus.value,
    int: null,
    // Plcaholders don't have their own scope so the body element inherits
    // just the snippets children
    body: [
      strip(open),
      strip(plus),
      strip(colon),
      ...snippet.body,
      strip(close)
    ],
    toString() {
      return this.body.join('')
    }
  }
}

// *********************************
// * Helper: Choice
// *********************************

export function choiceSimple([
  open,
  int,
  pipeOpen,
  textOrExpansion,
  options,
  pipeClose,
  close
]) {
  return {
    type: 'Choice',
    id: uniqid(),
    int: int.value,
    modifier: null,
    body: [
      strip(open),
      strip(int),
      strip(pipeOpen),
      textOrExpansion || emptyChoice(),
      ...flatMap(options, ([colon, textOrExpansion]) => [
        strip(colon),
        textOrExpansion || emptyChoice()
      ]),
      strip(pipeClose),
      strip(close)
    ],
    toString() {
      return this.body.join('')
    }
  }
}

export function choiceAnchor([
  open,
  equals,
  int,
  pipeOpen,
  textOrExpansion,
  options,
  pipeClose,
  close
]) {
  return {
    type: 'Choice',
    id: uniqid(),
    int: int.value,
    modifier: equals.value,
    body: [
      strip(open),
      strip(equals),
      strip(int),
      strip(pipeOpen),
      textOrExpansion || emptyChoice(),
      ...flatMap(options, ([colon, textOrExpansion]) => [
        strip(colon),
        textOrExpansion || emptyChoice()
      ]),
      strip(pipeClose),
      strip(close)
    ],
    toString() {
      return this.body.join('')
    }
  }
}

export function choiceIncrementor([
  open,
  plus,
  pipeOpen,
  textOrExpansion,
  options,
  pipeClose,
  close
]) {
  return {
    type: 'Choice',
    id: uniqid(),
    int: null,
    modifier: plus.value,
    body: [
      strip(open),
      strip(plus),
      strip(pipeOpen),
      textOrExpansion || emptyChoice(),
      ...flatMap(options, ([colon, textOrExpansion]) => [
        strip(colon),
        textOrExpansion || emptyChoice()
      ]),
      strip(pipeClose),
      strip(close)
    ],
    toString() {
      return this.body.join('')
    }
  }
}

// RULES

export function choiceNoIncrementorInteger([
  open,
  plus,
  int,
  pipeOpen,
  textOrExpansion,
  options,
  pipeClose,
  close
]) {
  return {
    type: 'Choice',
    id: uniqid(),
    int: null,
    modifier: plus.value,
    body: [
      strip(open),
      strip(plus),
      strip(pipeOpen),
      textOrExpansion || emptyChoice(),
      ...flatMap(options, ([colon, textOrExpansion]) => [
        strip(colon),
        textOrExpansion || emptyChoice()
      ]),
      strip(pipeClose),
      strip(close)
    ],
    toString() {
      return this.body.join('')
    }
  }
}

// *********************************
// * Helper: Variable
// *********************************

export function variableSimple([dollar, name]) {
  return {
    type: 'Variable',
    id: uniqid(),
    name: name.value,
    body: [],
    block: false,
    tokens: [strip(dollar), strip(name)],
    toString() {
      return `$${this.name}`
    }
  }
}

export function variableBlock([open, name, close]) {
  return {
    type: 'Variable',
    id: uniqid(),
    name: name.value,
    body: [],
    block: true,
    tokens: [strip(open), strip(name), strip(close)],
    toString() {
      return `\${${this.name}}`
    }
  }
}

export function variablePlaceholder([open, name, colon, snippet, close]) {
  return {
    type: 'Variable',
    id: uniqid(),
    name: name.value,
    body: [
      strip(open),
      strip(name),
      strip(colon),
      ...snippet.body,
      strip(close)
    ],
    block: true,
    toString() {
      return this.body.join('')
    }
  }
}

export function variableTransform([open, variable, transform, close]) {
  return {
    type: 'Transform',
    id: uniqid(),
    subtype: 'Variable',
    reference: variable.value,
    pattern: transform.pattern,
    replacement: transform.replacement,
    flags: transform.flags,
    toString() {
      return `\${${this.reference}/${this.pattern}/${this.replacement.join(
        ''
      )}/${this.flags || ''}}`
    }
  }
}

export function transform([
  slash,
  pattern,
  secondSlash,
  formatOrReplacemnt,
  thirdSlash,
  flags
]) {
  return {
    pattern: pattern.value,
    replacement: formatOrReplacemnt.map(replacement),
    flags: flags ? flags.value : null
  }
}

export function expansion([open, exclamation, text, separatedArgs, close]) {
  let args = separatedArgs.map(([colon, snippet]) => `${snippet}`)

  return {
    type: 'Expansion',
    id: uniqid(),
    reference: text.value,
    args,
    body: [
      strip(open),
      strip(exclamation),
      text,
      ...flatMap(separatedArgs, (colon, snippet) => [strip(colon), snippet]),
      strip(close)
    ],
    toString() {
      return this.body.join('')
    }
  }
}

export function expansionSlot([open, exclamation, int, close]) {
  return {
    type: 'ExpansionSlot',
    id: uniqid(),
    int: int.value,
    body: [strip(open), strip(exclamation), strip(int), strip(close)],
    toString() {
      return this.body.join('')
    }
  }
}

export function snippetFunction([open, pound, name, separatedArgs, close]) {
  let args = separatedArgs.map(([colon, text]) => text.value)
  let separator = args.length > 0 ? ':' : ''

  return {
    type: 'SnippetFunction',
    id: uniqid(),
    name: name.value,
    args,
    toString() {
      return `\${#${this.name}${separator}${this.args.join(':')}}`
    }
  }
}
