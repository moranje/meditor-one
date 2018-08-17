// prettier-ignore
let headings = [
  'Reden van komst', 'Reden van consult', 'Ambulance', 'Eerste opvang',
  'Voorgeschiedenis', 'Medicatie', 'Allergieën', 'Intoxicaties', 'Anamnese',
  'Heteroanamnese', 'Neurologisch onderzoek', 'Lichamelijk onderzoek',
  'Primary survey volgens ATLS', 'Primary survey', 'Secondary survey',
  'Aanvullend onderzoek', 'Conclusie', 'Beleid[^\\n]*', 'Decursus'
];

const emphasized = /^[A-Z][a-zA-Z-/]*?[:/]/;
const headingsPattern = new RegExp('^(' + headings.join('|') + ')$');
// const space = /(\s\s+|\s,)/;

export default {
  tokenizer: {
    root: [
      [headingsPattern, 'headings'],
      [emphasized, 'emphasized']
      // [space, 'space']
    ]
  }
};
