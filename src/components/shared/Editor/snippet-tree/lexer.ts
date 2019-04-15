import moo from 'moo'

const lexer = moo.states({
  main: {
    open: { match: /\${/, push: 'nested' },
    dollar: { match: /\$/, push: 'unnested' },

    lineComment: /^#[^\n]*\n?/,
    inlineComment: /#[^\n]*/,
    escape: /\\./,
    newline: { match: /\n/, lineBreaks: true },

    text: moo.fallback
  },

  nestedSnippet: {
    // Tabstop and variable blocks might end here
    close: { match: /\}/, pop: true },

    open: { match: /\${/, push: 'nested' },
    dollar: { match: /\$/, push: 'unnested' },
    escape: /\\./,
    newline: { match: /\n/, lineBreaks: true },

    text: moo.fallback
  },

  unnested: {
    int: { match: /\d+/, pop: true }, // tabstop
    plus: { match: /\+/, pop: true }, // tabstopIncrementor
    name: { match: /[a-zA-Z][a-zA-Z0-9_]+/, pop: true }, // variable

    equals: { match: /=(?=\d)/, next: 'tabstopAnchor' }
  },

  tabstopAnchor: {
    int: { match: /\d+/, pop: true }
  },

  nested: {
    int: { match: /\d+/, next: 'placeholder' },
    plus: { match: /\+/, next: 'placeholderIncrementor' },
    equals: { match: /=(?=\d)/, next: 'placeholderAnchor' },
    name: { match: /[a-zA-Z][a-zA-Z0-9_]+/, next: 'variable' },
    exclamation: { match: /!/, next: 'expansion' },
    pound: { match: /#/, next: 'function' }
  },

  placeholder: {
    close: { match: /\}/, pop: true },

    colon: { match: /:/, next: 'nestedSnippet' },
    pipe: { match: /\|/, next: 'choice' },
    slash: { match: /\//, next: 'pattern' }
  },

  placeholderAnchor: {
    close: { match: /\}/, pop: true },

    colon: { match: /:/, next: 'nestedSnippet' },
    pipe: { match: /\|/, next: 'choice' },
    slash: { match: /\//, next: 'pattern' },

    int: /\d+/
  },

  placeholderIncrementor: {
    close: { match: /\}/, pop: true },

    colon: { match: /:/, next: 'nestedSnippet' },
    pipe: { match: /\|/, next: 'choice' },
    slash: { match: /\//, next: 'pattern' },

    // FIXME: remove this when snippets have been migrated over
    int: /\d+/
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
    close: { match: /\}/, pop: true },

    colon: { match: /:/, next: 'snippetArgs' },
    int: { match: /\d+(?=\})/, next: 'expansionSlot' },

    name: /[a-zA-Z_ -]+/,
    newline: { match: /\n/, lineBreaks: true },

    text: moo.fallback
  },

  expansionSlot: {
    close: { match: /\}/, pop: true }
  },

  function: {
    close: { match: /\}/, pop: true },

    colon: { match: /:/, next: 'textArgs' },

    name: /[a-zA-Z_]+/
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

  textArgs: {
    close: { match: /\}/, pop: true },

    colon: /:/,
    escape: /\\./,
    newline: { match: /\n/, lineBreaks: true },

    text: moo.fallback
  },

  snippetArgs: {
    close: { match: /\}/, pop: true },

    colon: { match: /:/, next: 'nestedSnippetArg' },

    escape: /\\./,
    newline: { match: /\n/, lineBreaks: true },

    text: moo.fallback
  },

  nestedSnippetArg: {
    close: { match: /\}/, pop: true },

    open: { match: /\${/, push: 'nested' },
    dollar: { match: /\$/, push: 'unnested' },

    colon: { match: /:/, next: 'nestedSnippetArg' },

    escape: /\\./,
    newline: { match: /\n/, lineBreaks: true },

    text: moo.fallback
  }
})

export default lexer
