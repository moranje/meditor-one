import { Language } from './language';

const STATUS_THEME = {
  base: 'vs',
  inherit: true,
  rules: [
    { token: 'headings', fontStyle: 'bold' },
    // { token: 'important', foreground: 'ff0000' },
    // { token: 'changed', foreground: 'FFA500' },
    { token: 'emphasized', fontStyle: 'italic' },
    {
      token: 'space',
      background: 'ffa500'
    }
  ]
};

function statusSyntax() {
  const headingsList = [
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
  const headings = new RegExp('^\\b(' + headingsList.join('|') + ')\\b$');
  const emphasized = /^[A-Z][a-zA-Z-/]*?[:/]/;
  const space = /((^|\b)\s{2,}($|\b))|((^|\b)(\s,))/;

  return {
    tokenizer: {
      root: [
        [headings, 'headings'],
        [emphasized, 'emphasized'],
        [space, 'space']
      ]
    }
  };
}

export default function initLanguages(monaco) {
  const snippet = new Language('snippet', monaco);
  const status = new Language('status', monaco);

  status.theme = STATUS_THEME;
  status.syntax = statusSyntax();

  return { snippet, status };
}
