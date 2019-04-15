import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { LANGUAGE_ID } from './language'

// prettier-ignore
let headings = [
  'Reden van komst', 'Reden van consult', 'Ambulance', 'Eerste opvang',
  'Voorgeschiedenis', 'Medicatie', 'Allergieën', 'Intoxicaties', 'Anamnese',
  'Heteroanamnese', 'Neurologisch onderzoek', 'Lichamelijk onderzoek',
  'Primary survey volgens ATLS', 'Primary survey', 'Secondary survey',
  'Aanvullend onderzoek', 'Conclusie', 'Beleid[^\\n$]*', 'Decursus', 'Subjectief', 'Objectief', 'Evaluatie', 'Plan'
]

const headingsPattern = new RegExp('^(' + headings.join('|') + ')$')

monaco.languages.setMonarchTokensProvider(LANGUAGE_ID, {
  defaultToken: 'text',

  tokenizer: {
    root: [
      [/\$/, 'tag', '@marker'],
      [/^#[^\n]*\n?/, 'comment'],
      [/\\./, 'text'],

      // Operators, once positive lookbehinds are a thing, make this more
      // accurate (?<=\})
      [/[|&=](?=\$)/, 'operator'],

      [headingsPattern, 'heading']
    ],

    // nestedSnippet: [
    //   [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }],

    //   [/\$\{/, { token: 'tag', bracket: '@open', next: '@nested' }],
    //   [/\\./, 'text']
    // ],

    marker: [
      [/\{/, { token: 'tag', bracket: '@open', switchTo: '@nested' }],
      [/</, { token: 'tag', bracket: '@open' }],
      [/!/, { token: 'annotation', switchTo: '@slot' }],
      [/>/, { token: 'tag', bracket: '@close', next: '@pop' }],

      [/\d+(?=<)/, 'variable'],
      [/[a-zA-Z][a-zA-Z0-9_]+(?=>)/, 'variable'],

      [/\d+/, 'variable', '@pop'],
      [/[a-zA-Z][a-zA-Z0-9_]+/, 'variable', '@pop']
    ],

    nested: [
      [/\d+/, { token: 'variable', switchTo: '@placeholder' }],
      [/[a-zA-Z][a-zA-Z0-9_]+/, { token: 'variable', switchTo: '@variable' }],
      [/!/, { token: 'annotation', switchTo: '@expansion' }],
      [/#/, { token: 'annotation', switchTo: '@action' }]
    ],

    placeholder: [
      [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }],
      [/</, { token: 'tag', bracket: '@open' }],
      [/>/, { token: 'tag', bracket: '@close' }],

      [/[a-zA-Z][a-zA-Z0-9_]+(?=>)/, 'variable'],

      [/:/, { token: 'delimiter', switchTo: '@args' }],
      [/\|/, { token: 'delimiter', switchTo: '@choice' }],
      [/\//, { token: 'delimiter', switchTo: '@pattern' }]
    ],

    choice: [
      [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }],

      [/!/, { token: 'annotation', next: '@expansion' }],

      [/\$\{/, { token: 'tag', bracket: '@open' }],
      [/\\./, 'text'],
      [/,/, 'delimiter'],
      [/\|/, 'delimiter']
    ],

    variable: [
      [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }],

      [/\//, { token: 'delimiter', switchTo: '@pattern' }],
      [/:/, { token: 'delimiter', switchTo: '@args' }]
    ],

    expansion: [
      [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }],

      [/\//, { token: 'delimiter', switchTo: '@slotKeyValuePair' }],

      [/[a-zA-Z][a-zA-Z0-9_]+/, 'string']
    ],

    slot: [
      [/\d+/, 'variable', '@pop'],
      [/[a-zA-Z][a-zA-Z0-9_]+/, 'variable', '@pop']
    ],

    action: [
      [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }],

      [/:/, { token: 'delimiter', switchTo: '@textArgs' }],

      [/[a-zA-Z_]+/, 'keyword']
    ],

    expression: [[/:/, { token: 'delimiter', switchTo: '@args' }]],

    pattern: [[/\//, { token: 'delimiter', switchTo: '@replacement' }]],

    replacement: [
      [
        /\$\{/,
        { token: 'regex.group.tag', bracket: '@open', next: '@nestedGroup' }
      ],
      [/\$/, { token: 'regex.group.tag', next: '@unnestedGroup' }],

      [/\//, { token: 'delimiter', switchTo: '@flags' }]
    ],

    unnestedGroup: [[/\d+/, 'regex.group.variable', '@pop']],

    nestedGroup: [
      [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }],

      [/\d+/, 'regex.group.variable'],
      [/:/, 'regex.group.modifier'],
      [/\+/, 'regex.group.modifier'],
      [/-/, 'regex.group.modifier'],
      [/\?/, 'regex.group.modifier'],
      [/\/upcase|\/downcase|\/capitalize/, 'regex.group.string.modifier']
    ],

    flags: [
      [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }],

      [/[gmi]{1,3}/, 'regex.group.variable']
    ],

    args: [
      [/!?=/, { token: 'operator', switchTo: '@expression' }],
      [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }],

      [/:/, 'delimiter'],
      [/\\./, 'text']
    ],

    textArgs: [
      [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }],

      [/:/, 'delimiter'],
      [/\\./, 'text']
    ],

    slotKeyValuePair: [
      [/:/, { token: 'delimiter', switchTo: '@slotValue' }],

      [/\d+/, 'variable'],
      [/[a-zA-Z][a-zA-Z0-9_]+/, 'variable']
    ],

    slotValue: [
      [/\//, { token: 'delimiter', switchTo: '@slotKeyValuePair' }],
      [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }]
    ]

    // snippetArgs: [
    //   [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }],

    //   [/:/, { token: 'delimiter', switchTo: '@nestedSnippetArg' }],

    //   [/\\./, 'text']
    // ],

    // nestedSnippetArg: [
    //   [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }],

    //   [/\$\{/, { token: 'tag', bracket: '@open', next: '@nested' }],

    //   [/:/, { token: 'delimiter', switchTo: '@nestedSnippetArg' }],

    //   [/\\./, 'text']
    // ]
  }
})
