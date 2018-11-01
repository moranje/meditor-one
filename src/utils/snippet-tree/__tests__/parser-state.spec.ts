import { parse } from '@/utils/snippet-tree';

describe('Unit: Parser State', () => {
  it('should have a single scope for a text element', () => {
    let ast = parse('Text');

    expect(ast.state.tabstopScope.length).toBe(1);
  });

  it('should have a single scope for a tabstop element', () => {
    let ast = parse('$1');

    expect(ast.state.tabstopScope.length).toBe(1);
  });

  it('should have a single scope for a placeholder element', () => {
    let ast = parse('${1:Hold place}');

    expect(ast.state.tabstopScope.length).toBe(1);
  });

  it('should have a single scope for a choice element', () => {
    let ast = parse('${1|One,Two,Three|}');

    expect(ast.state.tabstopScope.length).toBe(1);
  });

  it('should have a single scope for a variable element', () => {
    let ast = parse('$scope');

    expect(ast.state.tabstopScope.length).toBe(1);
  });

  it('should have a single scope for a variable element', () => {
    let ast = parse('$scope');

    expect(ast.state.tabstopScope.length).toBe(1);
  });

  it('should have a single scope for a function element', () => {
    let context = {
      functions: {
        add(first, second) {
          return +first + +second;
        }
      }
    };
    let ast = parse('${#add:3:7}', context);

    expect(ast.state.tabstopScope.length).toBe(1);
  });

  it('should have a single scope for a expansion slot element', () => {
    let context = {
      slots: {
        slotScope: [['This is an expansion']],
        scopeQueue: [0]
      }
    };
    let ast = parse('${!1}', context);

    expect(ast.state.tabstopScope.length).toBe(1);
  });

  // Incrementors should create a an extra scope
  it('should add a scope for an incrementor modifier', () => {
    let ast = parse('$+');

    expect(ast.state.tabstopScope.length).toBe(2);
  });

  // Expansions should create an extra scope
  it('should add a scope for an expansion', () => {
    let context = {
      snippets: [{ name: 'reference', value: 'This is an expansion' }]
    };
    let ast = parse('${!reference}', context);

    expect(ast.state.tabstopScope.length).toBe(2);
  });
});
