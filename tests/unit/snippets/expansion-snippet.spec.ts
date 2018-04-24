import { Expansion, SnippetList } from '@/components/editor/snippet';

describe('expansion-snippet.ts', () => {
  it('should correctly expand expansion references', () => {
    let snippet = new Expansion(
      '${!expansion}',
      new SnippetList('${!expansion} $1', [
        {
          name: 'expansion',
          value: '$1 $2 $3'
        }
      ])
    );

    expect(snippet.expand().tabstops.serialize()).toBe('1:$1 2:$2 3:$3');
  });

  it('should correctly expand nested placeholders', () => {
    let list = new SnippetList('${!expansion} ${1:first}', [
      {
        name: 'expansion',
        value: '$1 ${2:second ${3:third}}'
      }
    ]);
    let snippet = new Expansion('${!expansion}', list);

    expect(list.serialize()).toBe('$2 ${3:second ${4:third}} ${1:first}');
  });

  it('should correctly expand nested placeholders', () => {
    let list = new SnippetList('${!expansion} ${1:first}', [
      {
        name: 'expansion',
        value: '$1 ${2:second $3}'
      }
    ]);
    let snippet = new Expansion('${!expansion}', list);

    expect(list.serialize()).toBe('$2 ${3:second $4} ${1:first}');
  });
});
