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

    // expect(snippet.expand().serialize()).toBe('$1 $2 $3');
    expect(snippet.expand().tabstops.serialize()).toBe('1:$1 2:$2 3:$3');
  });
});
