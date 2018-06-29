export default {
  base: 'vs',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '9e9e9e' },
    { token: 'tag', foreground: '33691e' },
    { token: 'modifier', foreground: '0d47a1' },
    { token: 'variable', foreground: '2196f3' },
    { token: 'separator', foreground: '607d8b' },
    { token: 'reference', fontStyle: 'italic' },

    { token: 'headings', fontStyle: 'bold' }
  ]
};
