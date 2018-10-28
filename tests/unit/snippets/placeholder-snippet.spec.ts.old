import { Placeholder } from '@/components/editor/snippet';

describe('placeholder-snippet.ts', () => {
  it("should parse it's parts", () => {
    let snippet = new Placeholder('${1:placeholder}');

    expect(snippet.tabstop).toBe(1);
    expect(snippet.placeholder).toBe('placeholder');
  });
});
