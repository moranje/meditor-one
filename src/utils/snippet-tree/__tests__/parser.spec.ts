import { parse } from '@/utils/snippet-tree';

const context = {
  snippets: [{ name: 'reference', value: '' }, { name: 'expansion', value: '' }]
};

describe('Unit: Parser', () => {
  // *****************************
  // TEXT
  // *****************************

  it('should parse text as a single AST node (`Text`)', () => {
    let ast = parse('Text');

    expect(`${ast}`).toBe('Text');
  });

  it('should parse escaped characters as text AST (`Text \\$ Text`)', () => {
    let ast = parse('Text \\$ Text');

    expect(`${ast}`).toBe('Text $ Text');
  });

  it('should parse (and and reparse) newline, tab and quote characters', () => {
    let ast = parse('\t\n"');
    let pup = parse(`${ast}`);

    expect(`${ast}`).toBe('\t\n"');
    expect(`${pup}`).toBe('\t\n"');
  });

  // *****************************
  // COMMENT
  // *****************************

  it('should parse a single comment per line (`# Comment 1\n#Comment 2\n# Comment 3`)', () => {
    let ast = parse('# Comment 1\n#Comment 2\n# Comment 3');

    expect(`${ast}`).toBe('');
  });

  // *****************************
  // TABSTOP
  // *****************************

  it('should parse tabstops (`$100`)', () => {
    let ast = parse('$100');

    // Will fill tabstop 'holes'
    expect(`${ast}`).toBe('$1');
  });

  it('should parse multiple matching tabstops (`$100 $100 $100`)', () => {
    let ast = parse('$100 $100 $100');

    // Will fill tabstop 'holes'
    expect(`${ast}`).toBe('$1 $1 $1');
  });

  it('should parse multiple mixed and matching tabstops (`$200 $100 $100 $100 $+ $=1 $+`)', () => {
    let ast = parse('$200 $100 $100 $100 $+ $=1 $+');

    expect(`${ast}`).toBe('$3 $2 $2 $2 $4 $1 $5');
  });

  it('should parse tabstop anchor (`$=100`)', () => {
    let ast = parse('$=100');
    expect(`${ast}`).toBe('$1');
  });

  it('should parse tabstop incrementor (`$+`)', () => {
    let ast = parse('$+');
    expect(`${ast}`).toBe('$1');
  });

  it('should parse tabstop blocks (`${100}`)', () => {
    let ast = parse('${100}');

    // Will fill tabstop 'holes'
    expect(`${ast}`).toBe('${1}');
  });

  it('should parse tabstop anchor blocks (`${=100}`)', () => {
    let ast = parse('${=100}');
    expect(`${ast}`).toBe('${1}');
  });

  it('should parse tabstop incrementor blocks (`${+}`)', () => {
    let ast = parse('${+}');
    expect(`${ast}`).toBe('${1}');
  });

  it('should parse tabstop transforms (`${100/(.*)/Test/gmi}`)', () => {
    let ast = parse('${100/(.*)/Test/gmi}');
    expect(`${ast}`).toBe('${100/(.*)/Test/gmi}');
  });

  it('should parse tabstop transforms (with group) (`${100/(.*)/Test $1/gmi}`)', () => {
    let ast = parse('${100/(.*)/Test $1/gmi}');
    expect(`${ast}`).toBe('${100/(.*)/Test $1/gmi}');
  });

  it('should parse tabstop transforms (with block group) (`${100/(.*)/Test ${1}/gmi}`)', () => {
    let ast = parse('${100/(.*)/Test ${1}/gmi}');
    expect(`${ast}`).toBe('${100/(.*)/Test ${1}/gmi}');
  });

  it('should parse tabstop transforms (with case modifier) (`${100/(.*)/Test ${1:/downcase}/gmi}`)', () => {
    let ast = parse('${100/(.*)/Test ${1:/downcase}/gmi}');
    expect(`${ast}`).toBe('${100/(.*)/Test ${1:/downcase}/gmi}');
  });

  it('should parse tabstop transforms (with if condition) (`${100/(.*)/Test ${1:+This}/gmi}`)', () => {
    let ast = parse('${100/(.*)/Test ${1:+This}/gmi}');
    expect(`${ast}`).toBe('${100/(.*)/Test ${1:+This}/gmi}');
  });

  it('should parse tabstop transforms (with if else condition) (`${100/(.*)/Test ${1:?This:That}/gmi}`)', () => {
    let ast = parse('${100/(.*)/Test ${1:?This:That}/gmi}');
    expect(`${ast}`).toBe('${100/(.*)/Test ${1:?This:That}/gmi}');
  });

  it('should parse tabstop transforms (with else condition) (`${100/(.*)/Test ${1:-That}/gmi}`)', () => {
    let ast = parse('${100/(.*)/Test ${1:-That}/gmi}');
    expect(`${ast}`).toBe('${100/(.*)/Test ${1:-That}/gmi}');
  });

  it('should parse tabstop transforms (with simple else condition) (`${100/(.*)/Test ${1:That}/gmi}`)', () => {
    let ast = parse('${100/(.*)/Test ${1:That}/gmi}');
    expect(`${ast}`).toBe('${100/(.*)/Test ${1:-That}/gmi}');
  });

  // *****************************
  // PLACEHOLDER
  // *****************************

  it('should parse placeholder (`${100:Text}`)', () => {
    let ast = parse('${100:Text}');
    expect(`${ast}`).toBe('${1:Text}');
  });

  it('should parse multiple matching placeholders (`${100:Text} ${100:Text} ${100:Text}`)', () => {
    let ast = parse('${100:Text} ${100:Text} ${100:Text}');

    // Will fill tabstop 'holes'
    expect(`${ast}`).toBe('${1:Text} ${1:Text} ${1:Text}');
  });

  it('should parse placeholders in deeply nested scopes (`${1:1${2:2${3:3}${4:4}}${5:5}}`)', () => {
    let ast = parse('${1:1${2:2${3:3}${4:4}}${5:5}}');

    // Will fill tabstop 'holes'
    expect(`${ast}`).toBe('${1:1${2:2${3:3}${4:4}}${5:5}}');
  });

  it('should parse placeholder anchor (`${=100:Text}`)', () => {
    let ast = parse('${=100:Text}');
    expect(`${ast}`).toBe('${1:Text}');
  });

  it('should parse placeholder incrementor (`${+:Text}`)', () => {
    let ast = parse('${+:Text}');
  });

  it('should parse nested placeholder (`${100:${101: Text }}`)', () => {
    let ast = parse('${100:${101: Text }}');

    // expect(ast).toBe(null)
    expect(`${ast}`).toBe('${1:${2: Text }}');
  });

  // *****************************
  // CHOICE
  // *****************************

  it('should parse choice (`${100|One,Two,Three|}`)', () => {
    let ast = parse('${100|One,Two,Three|}');
    expect(`${ast}`).toBe('${1|One,Two,Three|}');
  });

  it('should parse multiple matching choices (`${100|One,Two,Three|} ${100|One,Two,Three|} ${100|One,Two,Three|}`)', () => {
    let ast = parse(
      '${100|One,Two,Three|} ${100|One,Two,Three|} ${100|One,Two,Three|}'
    );

    // Will fill tabstop 'holes'
    expect(`${ast}`).toBe(
      '${1|One,Two,Three|} ${1|One,Two,Three|} ${1|One,Two,Three|}'
    );
  });

  it('should parse choice anchor (`${=1|1,2,3|}`)', () => {
    let ast = parse('${=1|1,2,3|}');
    expect(`${ast}`).toBe('${1|1,2,3|}');
  });

  it('should parse choice incrementor (`${+|1,2,3|}`)', () => {
    let ast = parse('${+|1,2,3|}');
    expect(`${ast}`).toBe('${1|1,2,3|}');
  });

  it('should parse choice with nested expansion (`${100|One,Two,${!reference}|}`)', () => {
    context.snippets[0].value = 'Three';
    let ast = parse('${100|One,Two,${!reference}|}', context);
    expect(`${ast}`).toBe('${1|One,Two,Three|}');
  });

  it('should parse choice with nested expansion with arguments (`${100|One,Two,${!reference:$1:${2:placeholder}:text}|}`)', () => {
    context.snippets[0].value = 'Three';
    let ast = parse(
      '${100|One,Two,${!reference:$1:${2:placeholder}:text}|}',
      context
    );
  });

  // *****************************
  // VARIABLE
  // *****************************

  it('should parse a variable (`$name`)', () => {
    let ast = parse('$name');
    expect(`${ast}`).toBe('$name');
  });
  it('should parse a block variable (`${name}`)', () => {
    let ast = parse('${name}');
    expect(`${ast}`).toBe('${name}');
  });

  it('should parse a variable with placeholder value (`${name:Text $1}`)', () => {
    let ast = parse('${name:Text $1}');
    expect(`${ast}`).toBe('${name:Text $1}');
  });

  it('should parse variable transforms (`${name/(.*)/Test/gmi}`)', () => {
    let ast = parse('${name/(.*)/Test/gmi}');
    expect(`${ast}`).toBe('${name/(.*)/Test/gmi}');
  });

  it('should parse variable transforms (with group) (`${name/(.*)/Test $1/gmi}`)', () => {
    let ast = parse('${name/(.*)/Test $1/gmi}');
    expect(`${ast}`).toBe('${name/(.*)/Test $1/gmi}');
  });

  it('should parse variable transforms (with block group) (`${name/(.*)/Test ${1}/gmi}`)', () => {
    let ast = parse('${name/(.*)/Test ${1}/gmi}');
    expect(`${ast}`).toBe('${name/(.*)/Test ${1}/gmi}');
  });

  it('should parse variable transforms (with case modifier) (`${name/(.*)/Test ${1:/downcase}/gmi}`)', () => {
    let ast = parse('${name/(.*)/Test ${1:/downcase}/gmi}');
    expect(`${ast}`).toBe('${name/(.*)/Test ${1:/downcase}/gmi}');
  });

  it('should parse variable transforms (with if condition) (`${name/(.*)/Test ${1:+This}/gmi}`)', () => {
    let ast = parse('${name/(.*)/Test ${1:+This}/gmi}');
    expect(`${ast}`).toBe('${name/(.*)/Test ${1:+This}/gmi}');
  });

  it('should parse variable transforms (with if else condition) (`${name/(.*)/Test ${1:?This:That}/gmi}`)', () => {
    let ast = parse('${name/(.*)/Test ${1:?This:That}/gmi}');
    expect(`${ast}`).toBe('${name/(.*)/Test ${1:?This:That}/gmi}');
  });

  it('should parse variable transforms (with else condition) (`${name/(.*)/Test ${1:-That}/gmi}`)', () => {
    let ast = parse('${name/(.*)/Test ${1:-That}/gmi}');
    expect(`${ast}`).toBe('${name/(.*)/Test ${1:-That}/gmi}');
  });

  it('should parse variable transforms (with simple else condition) (`${name/(.*)/Test ${1:That}/gmi}`)', () => {
    let ast = parse('${name/(.*)/Test ${1:That}/gmi}');
    expect(`${ast}`).toBe('${name/(.*)/Test ${1:-That}/gmi}');
  });

  // *****************************
  // EXPANSION
  // *****************************

  it('should parse expansion (`${!reference}`)', () => {
    context.snippets[0].value = 'This is an expansion';
    let ast = parse('${!reference}', context);
    expect(`${ast}`).toBe('This is an expansion');
  });

  it('should parse expansion with arguments (`${!reference:this:$100:${=2:placeholder}:${+|1,2,3|}:${!expansion}}`)', () => {
    context.snippets[0].value = '${!5}. And ${!1} ${!2} an ${!3} as well.';
    context.snippets[1].value = 'This is an expansion';
    let ast = parse(
      '${!reference:this:$100:${=2:expansion}:${+|1,2,3|}:${!expansion}}',
      context
    );
    expect(`${ast}`).toBe(
      // Since $100 is higher that ${=2}, the first index end up being higher
      'This is an expansion. And this $2 an ${1:expansion} as well.'
    );
  });

  it('should parse expansions with nested tabstops (`Tabstop: $1. ${!reference} Tabstop: $2.`)', () => {
    context.snippets[0].value = '2nd Level: $1. ${!expansion} And $2.';
    context.snippets[1].value = 'Final level: $1.';
    let ast = parse('Tabstop: $1. ${!reference} Tabstop: $2.', context);
    expect(`${ast}`).toBe(
      // Since $100 is higher that ${=2}, the first index end up being higher
      'Tabstop: $1. 2nd Level: $3. Final level: $5. And $4. Tabstop: $2.'
    );
  });

  it('should parse expansions with nested slots (`First level. ${!reference:success}`)', () => {
    // @ts-ignore
    context.snippets[0].value = 'Second level ${!1}. ${!expansion:success}';
    context.snippets[1].value = 'Final level: ${!1} and done.';
    let ast = parse('First level. ${!reference:success}', context);
    expect(`${ast}`).toBe(
      'First level. Second level success. Final level: success and done.'
    );
  });

  // *****************************
  // EXPANSION SLOT
  // *****************************

  it('should parse expansion slots (`${!1}`)', () => {
    // @ts-ignore
    context.slots.slotScope = [['This is an expansion']];
    // @ts-ignore
    context.slots.scopeQueue = [0];
    let ast = parse('${!1}', context);
    expect(`${ast}`).toBe('This is an expansion');
  });

  // *****************************
  // FUNCTION
  // *****************************

  it('should parse a function with arguments (`${#function:arg1:arg2}`)', () => {
    // @ts-ignore
    context.functions = {
      add(first, second) {
        return +first + +second;
      }
    };
    let ast = parse('${#add:3:7}', context);

    expect(`${ast}`).toBe('10');
  });
});
