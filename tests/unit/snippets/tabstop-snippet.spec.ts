import { Tabstop, SnippetList } from '@/components/editor/snippet';

describe('tabstop-snippet.ts', () => {
  it('should parse correctly expand expansion references', () => {
    let snippet = new Tabstop('$1', new SnippetList('$1'));

    // expect(snippet.expand().serialize()).toBe('$1 $2 $3');
    expect(snippet.serialize()).toBe('1:$1');
  });
});
