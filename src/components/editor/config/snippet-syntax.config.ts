// prettier-ignore
let headings = [
  'Reden van komst', 'Reden van consult', 'Ambulance', 'Eerste opvang',
  'Voorgeschiedenis', 'Medicatie', 'Allergieën', 'Intoxicaties', 'Anamnese',
  'Heteroanamnese', 'Neurologisch onderzoek', 'Lichamelijk onderzoek',
  'Primary survey volgens ATLS', 'Primary survey', 'Secondary survey',
  'Aanvullend onderzoek', 'Conclusie', 'Beleid[^\\n$]*', 'Decursus'
];

const headingsPattern = new RegExp('^(' + headings.join('|') + ')$');

export default {
  defaultToken: 'text',

  // brackets: [['${', '}', 'tag']],

  tokenizer: {
    root: [
      [/\$\{/, { token: 'tag', bracket: '@open', next: '@nested' }],
      [/\$/, 'tag', '@unnested'],

      [/^#[^\n]*\n/, 'comment'],
      [/#[^\n]*/, 'comment'],
      [/\\./, 'text'],

      [headingsPattern, 'headings']
    ],

    nestedSnippet: [
      [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }],

      [/\$\{/, { token: 'tag', bracket: '@open', next: '@nested' }],
      [/\$/, 'tag', '@unnested'],
      [/\\./, 'text']
    ],

    unnested: [
      [/\d+/, 'variable', '@pop'],
      [/\+/, 'modifier', '@pop'],
      [/[a-zA-Z][a-zA-Z0-9_]+/, 'variable', '@pop'],

      [/=(?=\d)/, { token: 'modifier', switchTo: '@tabstopAnchor' }]
    ],

    tabstopAnchor: [[/\d+/, 'variable', '@pop']],

    nested: [
      [/\d+/, { token: 'variable', switchTo: '@placeholder' }],
      [/\+/, { token: 'modifier', switchTo: '@placeholderIncrementor' }],
      [/=(?=[0-9])/, { token: 'modifier', switchTo: '@placeholderAnchor' }],
      [/[a-zA-Z][a-zA-Z0-9_]+/, { token: 'variable', switchTo: '@variable' }],
      [/!/, { token: 'modifier', switchTo: '@expansion' }],
      [/#/, { token: 'modifier', switchTo: '@function' }]
    ],

    placeholder: [
      [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }],

      [/:/, { token: 'separator', switchTo: '@nestedSnippet' }],
      [/\|/, { token: 'separator', switchTo: '@choice' }],
      [/\//, { token: 'separator', switchTo: '@pattern' }]
    ],

    placeholderAnchor: [
      [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }],

      [/:/, { token: 'separator', switchTo: '@nestedSnippet' }],
      [/\|/, { token: 'separator', switchTo: '@choice' }],
      [/\//, { token: 'separator', switchTo: '@pattern' }],

      [/\d+/, 'variable']
    ],

    placeholderIncrementor: [
      [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }],

      [/:/, { token: 'separator', switchTo: '@nestedSnippet' }],
      [/\|/, { token: 'separator', switchTo: '@choice' }],
      [/\//, { token: 'separator', switchTo: '@pattern' }]
    ],

    choice: [
      [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }],

      [/!/, { token: 'modifier', next: '@expansion' }],

      [/\$\{/, { token: 'tag', bracket: '@open' }],
      [/\\./, 'text'],
      [/,/, 'separator'],
      [/\|/, 'separator']
    ],

    variable: [
      [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }],

      [/\//, { token: 'separator', switchTo: '@pattern' }],
      [/:/, { token: 'separator', switchTo: '@nestedSnippet' }]
    ],

    expansion: [
      [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }],

      [/:/, { token: 'separator', switchTo: '@snippetArgs' }],
      [/\d+(?=\})/, { token: 'variable', switchTo: '@expansionSlot' }],

      [/[a-zA-Z_ -]+/, 'reference']
    ],

    expansionSlot: [[/\}/, { token: 'tag', bracket: '@close', next: '@pop' }]],

    function: [
      [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }],

      [/:/, { token: 'separator', switchTo: '@textArgs' }],

      [/[a-zA-Z_]+/, 'function']
    ],

    pattern: [[/\//, { token: 'separator', switchTo: '@replacement' }]],

    replacement: [
      [
        /\$\{/,
        { token: 'regexGroupTag', bracket: '@open', next: '@nestedGroup' }
      ],
      [/\$/, { token: 'regexGroupTag', next: '@unnestedGroup' }],

      [/\//, { token: 'separator', switchTo: '@flags' }]
    ],

    unnestedGroup: [[/\d+/, 'regexGroupVariable', '@pop']],

    nestedGroup: [
      [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }],

      [/\d+/, 'regexGroupVariable'],
      [/:/, 'regexGroupModifier'],
      [/\+/, 'regexGroupModifier'],
      [/-/, 'regexGroupModifier'],
      [/\?/, 'regexGroupModifier'],
      [/\/upcase|\/downcase|\/capitalize/, 'regexGroupStringModifier']
    ],

    flags: [
      [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }],

      [/[gmi]{1,3}/, 'regexGroupVariable']
    ],

    textArgs: [
      [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }],

      [/:/, 'separator'],
      [/\\./, 'text']
    ],

    snippetArgs: [
      [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }],

      [/:/, { token: 'separator', switchTo: '@nestedSnippetArg' }],

      [/\\./, 'text']
    ],

    nestedSnippetArg: [
      [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }],

      [/\$\{/, { token: 'tag', bracket: '@open', next: '@nested' }],
      [/\$/, 'tag', '@unnested'],

      [/:/, { token: 'separator', switchTo: '@nestedSnippetArg' }],

      [/\\./, 'text']
    ]
  }
};
