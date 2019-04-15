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
    equals: /[=](?=\$)/
  },

  marker: {
    open: { match: /\{/, next: 'nested' },
    openTag: /</,
    exclamation: { match: /!/, next: 'slot' },
    closeTag: { token: />/, pop: true },

    namedInt: /\d+(?=<)/, // named marker
    intName: /[a-zA-Z][a-zA-Z0-9_]+(?=>)/, // named marker name

    int: { match: /\d+/, pop: true }, // marker
    name: { match: /[a-zA-Z][a-zA-Z0-9_]+/, pop: true } // variable
  },

  nested: {
    int: { match: /\d+/, next: 'placeholder' },
    name: { match: /[a-zA-Z][a-zA-Z0-9_]+/, next: 'variable' },
    exclamation: { match: /!/, next: 'expansion' },
    pound: { match: /#/, next: 'action' }
  },

  placeholder: {
    close: { match: /\}/, pop: true },
    openTag: /</,
    closeTag: />/,

    intName: /[a-zA-Z][a-zA-Z0-9_]+(?=>)/, // named placeholder name

    colon: { match: /:/, next: 'args' },
    pipe: { match: /\|/, next: 'choice' },
    slash: { match: /\//, next: 'pattern' }
  },

  choice: {
    text: moo.fallback,

    close: { match: /\}/, pop: true },

    exclamation: { match: /!/, push: 'expansion' },

    open: /\${/,
    escape: /\\./,
    comma: /,/,
    pipe: /\|/,
    newline: { match: /\n/, lineBreaks: true }
  },

  variable: {
    close: { match: /\}/, pop: true },

    slash: { match: /\//, next: 'pattern' },
    colon: { match: /:/, next: 'nestedSnippet' }
  },

  expansion: {
    text: moo.fallback,

    close: { match: /\}/, pop: true },

    slash: { match: /\//, next: 'slotKeyValuePair' },

    name: /[a-zA-Z][a-zA-Z0-9_]+/,
    newline: { match: /\n/, lineBreaks: true }
  },

  slot: {
    int: { match: /\d+/, pop: true },
    name: { match: /[a-zA-Z][a-zA-Z0-9_]+/, pop: true }
  },

  action: {
    close: { match: /\}/, pop: true },

    colon: { match: /:/, next: 'textArgs' },

    name: /[a-zA-Z_]+/
  },

  expression: {
    text: moo.fallback,

    colon: { match: /:/, next: 'args' }
  },

  pattern: {
    pattern: moo.fallback,

    slash: { match: /\//, next: 'replacement' }
  },

  replacement: {
    replacement: moo.fallback,

    open: { match: /\${/, push: 'nestedGroup' },
    dollar: { match: /\$/, push: 'unnestedGroup' },

    slash: { match: /\//, next: 'flags' }
  },

  unnestedGroup: {
    int: { match: /\d+/, pop: true }
  },

  nestedGroup: {
    condition: moo.fallback,

    close: { match: /\}/, pop: true },

    int: /\d+/,
    colon: /:/,
    plus: /\+/,
    minus: /-/,
    questionmark: /\?/,
    caseModifier: /\/upcase|\/downcase|\/capitalize/
  },

  flags: {
    close: { match: /\}/, pop: true },

    flags: /[gmi]{1,3}/
  },

  args: {
    text: moo.fallback,

    operator: { match: /!?=/, next: 'expression' },
    close: { match: /\}/, pop: true },

    colon: /:/,

    escape: /\\./,
    newline: { match: /\n/, lineBreaks: true }
  },

  textArgs: {
    text: moo.fallback,

    close: { match: /\}/, pop: true },

    colon: /:/,
    escape: /\\./,
    newline: { match: /\n/, lineBreaks: true }
  },

  slotKeyValuePair: {
    colon: { match: /:/, next: 'slotValue' },

    int: /\d+/,
    name: /[a-zA-Z][a-zA-Z0-9_]+/
  },

  slotValue: {
    text: moo.fallback,

    slash: { match: /\//, next: 'slotKeyValuePair' },
    close: { match: /\}/, pop: true },

    escape: /\\./,
    newline: { match: /\n/, lineBreaks: true }
  }
})
