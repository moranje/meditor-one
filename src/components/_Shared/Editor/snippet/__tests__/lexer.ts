import lexer from '@/components/_Shared/Editor/snippet/lexer'

function mapTokens(text: string, tokenMap: string[]) {
  return () => {
    lexer.reset(text)
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual(tokenMap)
  }
}

describe('Unit: Lexer', () => {
  // *****************************
  // TEXT
  // *****************************

  it('should tokenize every text character as a token', () => {
    lexer.reset('One')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual(['text'])
  })

  it('should tokenize escaped characters', () => {
    lexer.reset('\\$')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual(['escape'])
  })

  // *****************************
  // COMMENT
  // *****************************

  it('should tokenize a single comment per line', () => {
    lexer.reset('# Comment 1\nText')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual(['comment', 'text'])
  })

  // *****************************
  // Placeholder
  // *****************************

  it('should tokenize simple placeholder', () => {
    lexer.reset('$100')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual(['dollar', 'int'])
  })

  it('should tokenize named simple placeholder', () => {
    lexer.reset('$100<name>')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'namedInt',
      'openTag',
      'name',
      'closeTag',
    ])
  })

  it('should tokenize simple placeholder block', () => {
    lexer.reset('${100}')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'open',
      'int',
      'close',
    ])
  })

  it('should tokenize placeholder block with argument', () => {
    lexer.reset('${100:Test}')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'open',
      'int',
      'colon',
      'text',
      'close',
    ])
  })

  it('should tokenize block nested placeholder argument', () => {
    lexer.reset('${100:$1${2:Test}${3|One,Two,Three|}}')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'open',
      'int',
      'colon',
      'dollar',
      'int',
      'dollar',
      'open',
      'int',
      'colon',
      'text',
      'close',
      'dollar',
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
      'close',
    ])
  })

  it('should tokenize placeholder transforms', () => {
    lexer.reset('${1/(.*)/Text/gmi}')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'open',
      'int',
      'slash',
      'text',
      'slash',
      'text',
      'slash',
      'text',
      'close',
    ])
  })

  it('should tokenize placeolder transforms (with group)', () => {
    lexer.reset('${1/(.*)/Text $1/gmi}')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'open',
      'int',
      'slash',
      'text',
      'slash',
      'text',
      'dollar',
      'int',
      'slash',
      'text',
      'close',
    ])
  })

  it('should tokenize placeolder transforms (with group block)', () => {
    lexer.reset('${1/(.*)/Text ${1}/gmi}')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'open',
      'int',
      'slash',
      'text',
      'slash',
      'text',
      'dollar',
      'open',
      'int',
      'close',
      'slash',
      'text',
      'close',
    ])
  })

  it('should tokenize placeolder transforms (with group case modifier)', () => {
    lexer.reset('${1/(.*)/Text ${1:/upcase}/gmi}')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'open',
      'int',
      'slash',
      'text',
      'slash',
      'text',
      'dollar',
      'open',
      'int',
      'colon',
      'caseModifier',
      'close',
      'slash',
      'text',
      'close',
    ])
  })

  it('should tokenize placeolder transforms (with group if condition)', () => {
    lexer.reset('${1/(.*)/Text ${1:+Print this}/gmi}')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'open',
      'int',
      'slash',
      'text',
      'slash',
      'text',
      'dollar',
      'open',
      'int',
      'colon',
      'plus',
      'condition',
      'close',
      'slash',
      'text',
      'close',
    ])
  })

  it('should tokenize placeolder transforms (with group if else condition)', () => {
    lexer.reset('${1/(.*)/Text ${1:?Print this:Or this}/gmi}')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'open',
      'int',
      'slash',
      'text',
      'slash',
      'text',
      'dollar',
      'open',
      'int',
      'colon',
      'questionmark',
      'condition',
      'colon',
      'condition',
      'close',
      'slash',
      'text',
      'close',
    ])
  })

  it('should tokenize placeolder transforms (with group else condition)', () => {
    lexer.reset('${1/(.*)/Text ${1:-Print this}/gmi}')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'open',
      'int',
      'slash',
      'text',
      'slash',
      'text',
      'dollar',
      'open',
      'int',
      'colon',
      'minus',
      'condition',
      'close',
      'slash',
      'text',
      'close',
    ])
  })

  // *****************************
  // CHOICE
  // *****************************

  it('should tokenize choice', () => {
    lexer.reset('${100|One,Two,Three|}')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
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
    ])
  })

  it('should tokenize choice with nested expansion', () => {
    lexer.reset('${100|${!exp},2,3|}')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'open',
      'int',
      'pipe',
      'dollar',
      'open',
      'exclamation',
      'name',
      'close',
      'comma',
      'text',
      'comma',
      'text',
      'pipe',
      'close',
    ])
  })

  // *****************************
  // VARIABLE
  // *****************************

  it('should tokenize variable', () => {
    lexer.reset('$name')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual(['dollar', 'name'])
  })

  it('should tokenize variable block', () => {
    lexer.reset('${name}')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'open',
      'name',
      'close',
    ])
  })

  it('should tokenize variable block with argument', () => {
    lexer.reset('${name:$1${2:Test}${3|One,Two,Three|}}')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'open',
      'name',
      'colon',
      'dollar',
      'int',
      'dollar',
      'open',
      'int',
      'colon',
      'text',
      'close',
      'dollar',
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
      'close',
    ])
  })

  it('should tokenize variable transforms', () => {
    lexer.reset('${name/(.*)/Text: $1/gmi}')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'open',
      'name',
      'slash',
      'text',
      'slash',
      'text',
      'dollar',
      'int',
      'slash',
      'text',
      'close',
    ])
  })

  it('should tokenize variable transforms (with group)', () => {
    lexer.reset('${name/(.*)/Text $1/gmi}')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'open',
      'name',
      'slash',
      'text',
      'slash',
      'text',
      'dollar',
      'int',
      'slash',
      'text',
      'close',
    ])
  })

  it('should tokenize variable transforms (with group block)', () => {
    lexer.reset('${name/(.*)/Text ${1}/gmi}')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'open',
      'name',
      'slash',
      'text',
      'slash',
      'text',
      'dollar',
      'open',
      'int',
      'close',
      'slash',
      'text',
      'close',
    ])
  })

  it('should tokenize variable transforms (with group case modifier)', () => {
    lexer.reset('${name/(.*)/Text ${1:/upcase}/gmi}')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'open',
      'name',
      'slash',
      'text',
      'slash',
      'text',
      'dollar',
      'open',
      'int',
      'colon',
      'caseModifier',
      'close',
      'slash',
      'text',
      'close',
    ])
  })

  it('should tokenize variable transforms (with group if condition)', () => {
    lexer.reset('${name/(.*)/Text ${1:+Print this}/gmi}')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'open',
      'name',
      'slash',
      'text',
      'slash',
      'text',
      'dollar',
      'open',
      'int',
      'colon',
      'plus',
      'condition',
      'close',
      'slash',
      'text',
      'close',
    ])
  })

  it('should tokenize variable transforms (with group if else condition)', () => {
    lexer.reset('${name/(.*)/Text ${1:?Print this:Or this}/gmi}')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'open',
      'name',
      'slash',
      'text',
      'slash',
      'text',
      'dollar',
      'open',
      'int',
      'colon',
      'questionmark',
      'condition',
      'colon',
      'condition',
      'close',
      'slash',
      'text',
      'close',
    ])
  })

  it('should tokenize variable transforms (with group else condition)', () => {
    lexer.reset('${name/(.*)/Text ${1:-Print this}/gmi}')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'open',
      'name',
      'slash',
      'text',
      'slash',
      'text',
      'dollar',
      'open',
      'int',
      'colon',
      'minus',
      'condition',
      'close',
      'slash',
      'text',
      'close',
    ])
  })

  // *****************************
  // TRANSFORM
  // *****************************

  it(
    'should tokenize transforms with single group',
    mapTokens('${1/(.*)/$1/}', [
      'dollar',
      'open',
      'int',
      'slash',
      'text',
      'slash',
      'dollar',
      'int',
      'slash',
      'close',
    ])
  )

  it(
    'should tokenize transforms with multiple simple groups',
    mapTokens(
      '${name/^(First.*)(Second.*)(Third.*)$/First: $1 Second: $2 Third: $3/}',
      [
        'dollar',
        'open',
        'name',
        'slash',
        'text',
        'slash',
        'text',
        'dollar',
        'int',
        'text',
        'dollar',
        'int',
        'text',
        'dollar',
        'int',
        'slash',
        'close',
      ]
    )
  )

  it(
    'should tokenize transforms starting with an uppercase format string modifier',
    mapTokens('${name/^(First.*)$/${1:/upcase}/}', [
      'dollar',
      'open',
      'name',
      'slash',
      'text',
      'slash',
      'dollar',
      'open',
      'int',
      'colon',
      'caseModifier',
      'close',
      'slash',
      'close',
    ])
  )

  it(
    'should tokenize transforms starting with an lowercase format string modifier',
    mapTokens('${name/^(First.*)$/${1:/downcase}/}', [
      'dollar',
      'open',
      'name',
      'slash',
      'text',
      'slash',
      'dollar',
      'open',
      'int',
      'colon',
      'caseModifier',
      'close',
      'slash',
      'close',
    ])
  )

  it(
    'should tokenize transforms starting with an capitalization format string modifier',
    mapTokens('${name/^(First.*)$/${1:/capitalize}/}', [
      'dollar',
      'open',
      'name',
      'slash',
      'text',
      'slash',
      'dollar',
      'open',
      'int',
      'colon',
      'caseModifier',
      'close',
      'slash',
      'close',
    ])
  )

  it(
    'should tokenize transforms starting with multiple case format string modifiers',
    mapTokens(
      '${name/^(First.*)(Second.*)(Third.*)$/${1:/upcase}${2:/downcase}${3:/capitalize}/}',
      [
        'dollar',
        'open',
        'name',
        'slash',
        'text',
        'slash',
        'dollar',
        'open',
        'int',
        'colon',
        'caseModifier',
        'close',
        'dollar',
        'open',
        'int',
        'colon',
        'caseModifier',
        'close',
        'dollar',
        'open',
        'int',
        'colon',
        'caseModifier',
        'close',
        'slash',
        'close',
      ]
    )
  )

  it(
    'should tokenize transforms starting with multiple case format string modifiers with text in between',
    mapTokens(
      '${name/^(First.*)(Second.*)(Third.*)$/This ${1:/upcase} is ${2:/downcase} a ${3:/capitalize} test./}',
      [
        'dollar',
        'open',
        'name',
        'slash',
        'text',
        'slash',
        'text',
        'dollar',
        'open',
        'int',
        'colon',
        'caseModifier',
        'close',
        'text',
        'dollar',
        'open',
        'int',
        'colon',
        'caseModifier',
        'close',
        'text',
        'dollar',
        'open',
        'int',
        'colon',
        'caseModifier',
        'close',
        'text',
        'slash',
        'close',
      ]
    )
  )

  it(
    'should tokenize transforms starting with an if condition format string modifier',
    mapTokens(
      '${name/^(First.*)$/${1:+Show this when the group holds any value}/}',
      [
        'dollar',
        'open',
        'name',
        'slash',
        'text',
        'slash',
        'dollar',
        'open',
        'int',
        'colon',
        'plus',
        'condition',
        'close',
        'slash',
        'close',
      ]
    )
  )

  it(
    'should tokenize transforms starting with an if-else condition format string modifier',
    mapTokens(
      '${name/^(First.*)$/${1:?Show this when the group holds any value:Show this when the group does not hold any value}/}',
      [
        'dollar',
        'open',
        'name',
        'slash',
        'text',
        'slash',
        'dollar',
        'open',
        'int',
        'colon',
        'questionmark',
        'condition',
        'colon',
        'condition',
        'close',
        'slash',
        'close',
      ]
    )
  )

  it(
    'should tokenize transforms starting with an else condition format string modifier',
    mapTokens(
      '${name/^(First.*)$/${1:-Show this when the group does not hold any value}/}',
      [
        'dollar',
        'open',
        'name',
        'slash',
        'text',
        'slash',
        'dollar',
        'open',
        'int',
        'colon',
        'minus',
        'condition',
        'close',
        'slash',
        'close',
      ]
    )
  )

  it(
    'should tokenize transforms with mixed format string modifiers  and group',
    mapTokens(
      '${name/^(First.*)(Second.*)(Third.*)$/This ${1:/upcase} is $2 a ${3:-Show this when the group does not hold any value} test./}',
      [
        'dollar',
        'open',
        'name',
        'slash',
        'text',
        'slash',
        'text',
        'dollar',
        'open',
        'int',
        'colon',
        'caseModifier',
        'close',
        'text',
        'dollar',
        'int',
        'text',
        'dollar',
        'open',
        'int',
        'colon',
        'minus',
        'condition',
        'close',
        'text',
        'slash',
        'close',
      ]
    )
  )

  // *****************************
  // EXPANSION
  // *****************************

  it('should tokenize expansion', () => {
    lexer.reset('${!my-expansion-snippet}')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'open',
      'exclamation',
      'name',
      'close',
    ])
  })

  it('should tokenize expansion with arguments', () => {
    lexer.reset(
      '${!my-expansion-snippet\n/1:Text\n/2:$100 : ${101:This as well}\n/3:last argument\n} '
    )
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'open',
      'exclamation',
      'name',
      'newline',
      'slash',
      'int',
      'colon',
      'text',
      'newline',
      'slash',
      'int',
      'colon',
      'dollar',
      'int',
      'text',
      'dollar',
      'open',
      'int',
      'colon',
      'text',
      'close',
      'newline',
      'slash',
      'int',
      'colon',
      'text',
      'newline',
      'close',
      'text',
    ])
  })

  // *****************************
  // SLOT
  // *****************************

  it('should tokenize numbered slot', () => {
    lexer.reset('$!1')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'exclamation',
      'int',
    ])
  })

  it('should tokenize named slot', () => {
    lexer.reset('$!name')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'exclamation',
      'name',
    ])
  })

  // *****************************
  // ACTION
  // *****************************

  it('should tokenize action', () => {
    lexer.reset('${#date}')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'open',
      'pound',
      'name',
      'close',
    ])
  })

  it('should tokenize action with arguments', () => {
    lexer.reset('${#if:this:that}')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'open',
      'pound',
      'name',
      'colon',
      'text',
      'colon',
      'text',
      'close',
    ])
  })

  // *****************************
  // Evaluation
  // *****************************

  it('should tokenize numbered evaluation', () => {
    lexer.reset('${1:!=:this}')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'open',
      'int',
      'operatorColon',
      'operator',
      'colon',
      'text',
      'close',
    ])
  })

  it('should tokenize named evaluation', () => {
    lexer.reset('${name:!=:this}')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'open',
      'name',
      'operatorColon',
      'operator',
      'colon',
      'text',
      'close',
    ])
  })

  // *****************************
  // Condition
  // *****************************

  it('should tokenize condition', () => {
    lexer.reset('${1:!=:this}&${name:!=:this}=${!2:expansion}')
    let tokens: any[] = Array.from(lexer)

    expect(tokens.map(token => token.type)).toEqual([
      'dollar',
      'open',
      'int',
      'operatorColon',
      'operator',
      'colon',
      'text',
      'close',
      'operator',
      'dollar',
      'open',
      'name',
      'operatorColon',
      'operator',
      'colon',
      'text',
      'close',
      'equals',
      'dollar',
      'open',
      'exclamation',
      'int',
      'colon',
      'name',
      'close',
    ])
  })
})
