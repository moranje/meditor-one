let head = [
  'Aanvullend onderzoek',
  'Allergieën',
  'Ambulance',
  'Anamnese',
  'Beleid.*?',
  'Conclusie',
  'Heteroanamnese',
  'Intoxicaties',
  'Lichamelijk onderzoek',
  'Medicatie',
  'Neurologisch onderzoek',
  'Primary survey volgens ATLS',
  'Primary survey',
  'Reden van consult',
  'Reden van komst',
  'Secondary survey',
  'Voorgeschiedenis'
];

const emphasized = /^[A-Z][a-zA-Z-/]*?[:/]/;
const headings = new RegExp('^\\b(' + head.join('|') + ')\\b$');
// const space = /(\s\s+|\s,)/;

const syntax = {
  tokenizer: {
    root: [
      [headings, 'headings'],
      [emphasized, 'emphasized']
      // [space, 'space']
    ]
  }
};

const theme = {
  base: 'vs',
  inherit: true,
  rules: [
    { token: 'headings', fontStyle: 'bold' },
    // { token: 'important', foreground: 'ff0000' },
    // { token: 'changed', foreground: 'FFA500' },
    { token: 'emphasized', fontStyle: 'italic' },
    { token: 'space', background: '777777' }
  ]
};

// TODO: add language suggestions
// TODO: add medication suggestions
function completionItems() {}

export function setupStatus(monaco) {
  monaco.languages.register({ id: 'status' });

  monaco.languages.setMonarchTokensProvider('status', syntax);
  monaco.editor.defineTheme('status-theme', theme);
}
