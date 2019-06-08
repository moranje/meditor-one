import moo from 'moo'

export default moo.states({
  main: {
    text: moo.fallback,

    dollar: { match: /\$/, push: 'marker' },

    comment: /^#[^\n]*\n?/,
    escape: /\\./,
    newline: { match: /\n/, lineBreaks: true },

    // Operators, once positive lookbehinds are a thing, make this more
    // accurate (?<=\})
    operator: /[|&](?=\$)/,
    equals: /[=](?=\$)/,
  },

  marker: {
    open: { match: /\{/, next: 'nested' },
    openTag: { match: /</, next: 'namedMarker' },
    exclamation: { match: /!/, next: 'slot' },

    namedInt: /\d+(?=<)/, // named marker

    int: { match: /\d+/, pop: true }, // marker
    name: { match: /[a-zA-Z][a-zA-Z0-9_-]+/, pop: true }, // variable
  },

  namedMarker: {
    closeTag: { match: />/, pop: true },

    name: /[a-zA-Z][a-zA-Z0-9_-]+/,
  },

  nested: {
    int: { match: /\d+/, next: 'placeholder' },
    name: { match: /[a-zA-Z][a-zA-Z0-9_-]+/, next: 'variable' },
    exclamation: { match: /!/, next: 'expansion' },
    pound: { match: /#/, next: 'action' },
  },

  placeholder: {
    close: { match: /\}/, pop: true },
    openTag: /</,
    closeTag: />/,

    operatorColon: { match: /:(?=!?=)/ },
    intName: /[a-zA-Z][a-zA-Z0-9_-]+(?=>)/, // named placeholder name

    operator: { match: /!?=/, next: 'expression' },
    colon: { match: /:/, next: 'level' },
    pipe: { match: /\|/, next: 'choice' },
    slash: { match: /\//, next: 'pattern' },
  },

  choice: {
    text: moo.fallback,

    close: { match: /\}/, pop: true },

    exclamation: { match: /!/, push: 'expansion' },
    dollar: { match: /\$/, push: 'marker' },

    escape: /\\./,
    comma: /,/,
    pipe: /\|/,
  },

  variable: {
    close: { match: /\}/, pop: true },

    operatorColon: { match: /:(?=!?=)/ },

    operator: { match: /!?=/, next: 'expression' },
    slash: { match: /\//, next: 'pattern' },
    colon: { match: /:/, next: 'level' },
  },

  expansion: {
    text: moo.fallback,

    // End of expansion element
    close: { match: /\}/, pop: true },
    // End of choice expansion element
    comma: { match: /,/, pop: true },

    slash: { match: /\//, next: 'slotKeyValuePair' },

    int: /\d+/,
    colon: /:/,
    name: /[a-zA-Z][a-zA-Z0-9_-]+/,
    newline: { match: /\n/, lineBreaks: true },
  },

  slot: {
    int: { match: /\d+/, pop: true },
    name: { match: /[a-zA-Z][a-zA-Z0-9_-]+/, pop: true },
  },

  action: {
    close: { match: /\}/, pop: true },

    colon: { match: /:/, next: 'textArgs' },

    name: /[a-zA-Z_]+/,
  },

  expression: {
    text: moo.fallback,

    close: { match: /\}/, pop: true },

    colon: { match: /:/ },
  },

  pattern: {
    text: moo.fallback,

    slash: { match: /\//, next: 'replacement' },
  },

  replacement: {
    text: moo.fallback,

    dollar: { match: /\$/, push: 'unnestedGroup' },

    slash: { match: /\//, next: 'flags' },
  },

  unnestedGroup: {
    open: { match: /{/, next: 'nestedGroup' },
    int: { match: /\d+/, pop: true },
  },

  nestedGroup: {
    condition: moo.fallback,

    close: { match: /\}/, pop: true },

    int: /\d+/,
    colon: /:/,
    plus: /\+/,
    minus: /-/,
    questionmark: /\?/,
    caseModifier: /\/upcase|\/downcase|\/capitalize/,
  },

  flags: {
    close: { match: /\}/, pop: true },

    text: /[gmi]{1,3}/,
  },

  level: {
    text: moo.fallback,

    dollar: { match: /\$/, push: 'marker' },
    close: { match: /\}/, pop: true },

    comment: /^#[^\n]*\n?/,
    escape: /\\./,
    newline: { match: /\n/, lineBreaks: true },
  },

  textArgs: {
    text: moo.fallback,

    close: { match: /\}/, pop: true },

    colon: /:/,
    escape: /\\./,
    newline: { match: /\n/, lineBreaks: true },
  },

  slotKeyValuePair: {
    colon: { match: /:/, next: 'slotValue' },

    int: /\d+/,
    name: /[a-zA-Z][a-zA-Z0-9_-]+/,
  },

  slotValue: {
    text: moo.fallback,

    dollar: { match: /\$/, push: 'marker' },
    slash: { match: /\//, next: 'slotKeyValuePair' },
    close: { match: /\}/, pop: true },

    escape: /\\./,
    newline: { match: /\n/, lineBreaks: true },
  },
})
