let headings = [
  'Reden van komst',
  'Reden van consult',
  'Ambulance',
  'Eerste opvang',
  'Voorgeschiedenis',
  'Medicatie',
  'Allergieën',
  'Intoxicaties',
  'Anamnese',
  'Heteroanamnese',
  'Neurologisch onderzoek',
  'Lichamelijk onderzoek',
  'Primary survey volgens ATLS',
  'Primary survey',
  'Secondary survey',
  'Aanvullend onderzoek',
  'Conclusie',
  'Beleid'
];

const headingsPattern = new RegExp('^\\b(' + headings.join('|') + ')\\b$');

export default {
  tokenizer: {
    root: [
      [/^#[^\n]*\n/, 'comment'],
      [/#[^\n]*/, 'comment.inline'],

      [/\$\{/, { token: 'tag', bracket: '@open', next: '@nested' }],
      [/\$/, 'tag', '@unnested'],
      [headingsPattern, 'headings']
    ],

    unnested: [
      [/[0-9]+/, 'variable', '@pop'],
      [/\+/, 'modifier', '@pop'],
      [/=(?=[0-9])/, 'modifier']
    ],

    nested: [
      [/\$\{/, { token: 'tag', bracket: '@open', next: '@push' }],
      [/:/, { token: 'separator', switchTo: '@args' }],
      [/\|/, { token: 'separator', switchTo: '@choice' }],
      [/\//, { token: 'separator', switchTo: '@variable' }],
      [/!/, { token: 'modifier', switchTo: '@expansion' }],
      [/#/, { token: 'modifier', switchTo: '@function' }],
      [/[0-9]+/, 'variable'],
      [/[a-zA-Z_]+/, 'variable'],
      [/\+/, { token: 'modifier', switchTo: 'noInt' }],
      [/=(?=[0-9])/, 'modifier']
    ],

    noInt: [[/:/, { token: 'separator', switchTo: '@args' }]],

    args: [
      [/\$\{/, { token: 'tag', bracket: '@open', next: '@nested' }],
      [/\$/, 'tag', '@unnested'],
      [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }],
      [/:/, 'separator']
    ],

    choice: [
      [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }],
      [/\|/, 'separator'],
      [/,/, 'separator']
    ],

    variable: [
      [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }],
      [/\//, 'separator']
    ],

    expansion: [
      [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }],
      [/:/, { token: 'separator', switchTo: '@args' }],
      [/[a-zA-Z_-\s]+/, 'reference']
    ],

    function: [
      [/\}/, { token: 'tag', bracket: '@close', next: '@pop' }],
      [/:/, { token: 'separator', switchTo: '@args' }],
      [/[a-zA-Z_]+/, 'variable']
    ]
  }
};
