let head = [
  'Reden van komst',
  'Reden van consult',
  'Ambulance',
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
  'Beleid[^\n]*?'
];

const emphasized = /^[A-Z][a-zA-Z-/]*?[:/]/;
const headings = new RegExp('^\\b(' + head.join('|') + ')\\b$');
// const space = /(\s\s+|\s,)/;

export default {
  tokenizer: {
    root: [
      [headings, 'headings'],
      [emphasized, 'emphasized']
      // [space, 'space']
    ]
  }
};
