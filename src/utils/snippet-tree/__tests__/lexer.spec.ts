import lexer from '@/utils/snippet-tree/lexer';

describe('Unit: Lexer', () => {
  // *****************************
  // TEXT
  // *****************************

  it('should tokenize every text character as a token', () => {
    lexer.reset('One');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual(['text']);
  });

  it('should tokenize escaped characters', () => {
    lexer.reset('\\$');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual(['escape']);
  });

  // *****************************
  // COMMENT
  // *****************************

  it('should tokenize a single comment per line', () => {
    lexer.reset('# Comment 1\nText #Comment 2\n# Comment 3');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual([
      'lineComment',
      'text',
      'inlineComment',
      'newline',
      'lineComment'
    ]);
  });

  // *****************************
  // TABSTOP
  // *****************************

  it('should tokenize tabstop', () => {
    lexer.reset('$100');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual(['dollar', 'int']);
  });

  it('should tokenize tabstop anchor', () => {
    lexer.reset('$=100');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'equals',
      'int'
    ]);
  });

  it('should tokenize tabstop incrementor', () => {
    lexer.reset('$+');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual(['dollar', 'plus']);
  });

  it('should tokenize tabstop block', () => {
    lexer.reset('${100}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual(['open', 'int', 'close']);
  });

  it('should tokenize tabstop block anchor', () => {
    lexer.reset('${=100}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual([
      'open',
      'equals',
      'int',
      'close'
    ]);
  });

  it('should tokenize tabstop block incrementor', () => {
    lexer.reset('${+}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual(['open', 'plus', 'close']);
  });

  it('should tokenize tabstop transforms', () => {
    lexer.reset('${1/(.*)/Text/gmi}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual([
      'open',
      'int',
      'slash',
      'pattern',
      'slash',
      'replacement',
      'slash',
      'flags',
      'close'
    ]);
  });

  it('should tokenize tabstop transforms (with group)', () => {
    lexer.reset('${1/(.*)/Text $1/gmi}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual([
      'open',
      'int',
      'slash',
      'pattern',
      'slash',
      'replacement',
      'dollar',
      'int',
      'slash',
      'flags',
      'close'
    ]);
  });

  it('should tokenize tabstop transforms (with group block)', () => {
    lexer.reset('${1/(.*)/Text ${1}/gmi}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual([
      'open',
      'int',
      'slash',
      'pattern',
      'slash',
      'replacement',
      'open',
      'int',
      'close',
      'slash',
      'flags',
      'close'
    ]);
  });

  it('should tokenize tabstop transforms (with group case modifier)', () => {
    lexer.reset('${1/(.*)/Text ${1:/upcase}/gmi}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual([
      'open',
      'int',
      'slash',
      'pattern',
      'slash',
      'replacement',
      'open',
      'int',
      'colon',
      'caseModifier',
      'close',
      'slash',
      'flags',
      'close'
    ]);
  });

  it('should tokenize tabstop transforms (with group if condition)', () => {
    lexer.reset('${1/(.*)/Text ${1:+Print this}/gmi}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual([
      'open',
      'int',
      'slash',
      'pattern',
      'slash',
      'replacement',
      'open',
      'int',
      'colon',
      'plus',
      'condition',
      'close',
      'slash',
      'flags',
      'close'
    ]);
  });

  it('should tokenize tabstop transforms (with group if else condition)', () => {
    lexer.reset('${1/(.*)/Text ${1:?Print this:Or this}/gmi}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual([
      'open',
      'int',
      'slash',
      'pattern',
      'slash',
      'replacement',
      'open',
      'int',
      'colon',
      'questionmark',
      'condition',
      'colon',
      'condition',
      'close',
      'slash',
      'flags',
      'close'
    ]);
  });

  it('should tokenize tabstop transforms (with group else condition)', () => {
    lexer.reset('${1/(.*)/Text ${1:-Print this}/gmi}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual([
      'open',
      'int',
      'slash',
      'pattern',
      'slash',
      'replacement',
      'open',
      'int',
      'colon',
      'minus',
      'condition',
      'close',
      'slash',
      'flags',
      'close'
    ]);
  });

  // *****************************
  // PLACEHOLDER
  // *****************************

  it('should tokenize placeholder', () => {
    lexer.reset('${100:Test}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual([
      'open',
      'int',
      'colon',
      'text',
      'close'
    ]);
  });

  it('should tokenize placeholder anchor', () => {
    lexer.reset('${=100:Test}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual([
      'open',
      'equals',
      'int',
      'colon',
      'text',
      'close'
    ]);
  });

  it('should tokenize placeholder incrementor', () => {
    lexer.reset('${+:Test}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual([
      'open',
      'plus',
      'colon',
      'text',
      'close'
    ]);
  });

  it('should tokenize nested placeholder', () => {
    lexer.reset('${100:$1${2:Test}${3|One,Two,Three|}}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual([
      'open',
      'int',
      'colon',
      'dollar',
      'int',
      'open',
      'int',
      'colon',
      'text',
      'close',
      'open',
      'int',
      'pipe',
      'text',
      'comma',
      'text',
      'comma',
      'text',
      'pipe',
      'close',
      'close'
    ]);
  });

  // *****************************
  // CHOICE
  // *****************************

  it('should tokenize choice', () => {
    lexer.reset('${100|One,Two,Three|}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual([
      'open',
      'int',
      'pipe',
      'text',
      'comma',
      'text',
      'comma',
      'text',
      'pipe',
      'close'
    ]);
  });

  it('should tokenize choice anchor', () => {
    lexer.reset('${=100|One,Two,Three|}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual([
      'open',
      'equals',
      'int',
      'pipe',
      'text',
      'comma',
      'text',
      'comma',
      'text',
      'pipe',
      'close'
    ]);
  });

  it('should tokenize choice incrementor', () => {
    lexer.reset('${+|One,Two,Three|}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual([
      'open',
      'plus',
      'pipe',
      'text',
      'comma',
      'text',
      'comma',
      'text',
      'pipe',
      'close'
    ]);
  });

  it('should tokenize choice with nested expansion', () => {
    lexer.reset('${100|1,2,${!exp}|}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual([
      'open',
      'int',
      'pipe',
      'text',
      'comma',
      'text',
      'comma',
      'open',
      'exclamation',
      'name',
      'close',
      'pipe',
      'close'
    ]);
  });

  // *****************************
  // VARIABLE
  // *****************************

  it('should tokenize variables', () => {
    lexer.reset('$name');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual(['dollar', 'name']);
  });

  it('should tokenize variableBlocks', () => {
    lexer.reset('${name}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual(['open', 'name', 'close']);
  });

  it('should tokenize variableBlocks', () => {
    lexer.reset('${name:Text $1}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual([
      'open',
      'name',
      'colon',
      'text',
      'dollar',
      'int',
      'close'
    ]);
  });

  it('should tokenize variable transforms', () => {
    lexer.reset('${name/(.*)/Text: $1/gmi}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual([
      'open',
      'name',
      'slash',
      'pattern',
      'slash',
      'replacement',
      'dollar',
      'int',
      'slash',
      'flags',
      'close'
    ]);
  });

  it('should tokenize variable transforms (with group)', () => {
    lexer.reset('${name/(.*)/Text $1/gmi}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual([
      'open',
      'name',
      'slash',
      'pattern',
      'slash',
      'replacement',
      'dollar',
      'int',
      'slash',
      'flags',
      'close'
    ]);
  });

  it('should tokenize variable transforms (with group block)', () => {
    lexer.reset('${name/(.*)/Text ${1}/gmi}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual([
      'open',
      'name',
      'slash',
      'pattern',
      'slash',
      'replacement',
      'open',
      'int',
      'close',
      'slash',
      'flags',
      'close'
    ]);
  });

  it('should tokenize variable transforms (with group case modifier)', () => {
    lexer.reset('${name/(.*)/Text ${1:/upcase}/gmi}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual([
      'open',
      'name',
      'slash',
      'pattern',
      'slash',
      'replacement',
      'open',
      'int',
      'colon',
      'caseModifier',
      'close',
      'slash',
      'flags',
      'close'
    ]);
  });

  it('should tokenize variable transforms (with group if condition)', () => {
    lexer.reset('${name/(.*)/Text ${1:+Print this}/gmi}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual([
      'open',
      'name',
      'slash',
      'pattern',
      'slash',
      'replacement',
      'open',
      'int',
      'colon',
      'plus',
      'condition',
      'close',
      'slash',
      'flags',
      'close'
    ]);
  });

  it('should tokenize variable transforms (with group if else condition)', () => {
    lexer.reset('${name/(.*)/Text ${1:?Print this:Or this}/gmi}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual([
      'open',
      'name',
      'slash',
      'pattern',
      'slash',
      'replacement',
      'open',
      'int',
      'colon',
      'questionmark',
      'condition',
      'colon',
      'condition',
      'close',
      'slash',
      'flags',
      'close'
    ]);
  });

  it('should tokenize variable transforms (with group else condition)', () => {
    lexer.reset('${name/(.*)/Text ${1:-Print this}/gmi}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual([
      'open',
      'name',
      'slash',
      'pattern',
      'slash',
      'replacement',
      'open',
      'int',
      'colon',
      'minus',
      'condition',
      'close',
      'slash',
      'flags',
      'close'
    ]);
  });

  // *****************************
  // EXPANSION
  // *****************************

  it('should tokenize expansion', () => {
    lexer.reset('${!expansion}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual([
      'open',
      'exclamation',
      'name',
      'close'
    ]);
  });

  it('should tokenize expansion with arguments', () => {
    lexer.reset('${!expansion:Text:$100:${101:This as well}}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual([
      'open',
      'exclamation',
      'name',
      'colon',
      'text',
      'colon',
      'dollar',
      'int',
      'colon',
      'open',
      'int',
      'colon',
      'text',
      'close',
      'close'
    ]);
  });

  // *****************************
  // EXPANSION SLOT
  // *****************************

  it('should tokenize expansion slots', () => {
    lexer.reset('${!1}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual([
      'open',
      'exclamation',
      'int',
      'close'
    ]);
  });

  // *****************************
  // FUNCTION
  // *****************************

  it('should tokenize function with arguments', () => {
    lexer.reset('${#if:this:that}');
    let tokens: any[] = Array.from(lexer);

    expect(tokens.map(token => token.type)).toEqual([
      'open',
      'pound',
      'name',
      'colon',
      'text',
      'colon',
      'text',
      'close'
    ]);
  });
});
