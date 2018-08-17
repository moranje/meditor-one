export default {
  base: 'vs',
  inherit: true,
  rules: [
    { token: 'headings', fontStyle: 'bold' },

    { token: 'tag', foreground: '1b5e20' },
    { token: 'comment', foreground: '777777', fontStyle: 'italic' },
    { token: 'text' },
    { token: 'variable', foreground: '1565c0' },
    { token: 'modifier', foreground: '4c8c4a' },
    { token: 'separator', foreground: '1b5e20' },
    { token: 'function', foreground: 'e65100' },
    { token: 'regexGroupTag', foreground: '311b92' },
    { token: 'regexGroupVariable', foreground: '880e4f' },
    { token: 'regexGroupModifier', foreground: 'bc477b' },
    { token: 'regexGroupStringModifier', foreground: 'bc477b' },
    { token: 'space', background: '777777' },

    { token: 'reference', fontStyle: 'underline' }
  ]
};
