import { SnippetList } from '@/components/editor/snippet';

describe('snippet-list.ts', () => {
  describe('special cases', () => {
    it('should handle parsing of empty strings', () => {
      const text = '';

      // Create a list with a single node
      expect(new SnippetList(text)).toHaveLength(1);
    });
  });

  describe('plain text', () => {
    it('should parse plain text', () => {
      const text = 'This is a piece of plain old text';

      // Create a list with a single node
      expect(new SnippetList(text)).toHaveLength(1);
    });

    it("should serialize a piece of text back to it's original form", () => {
      const text = 'This is a piece of plain old text';

      expect(new SnippetList(text).serialize()).toBe(text);
    });
  });

  describe('snippets', () => {
    it('should compile snippets back to their orginal form', () => {
      const text =
        "This ${3|is,isn't|} a ${1:complex} $2 ${2/is/, luckily/}.${!expansion}";
      const result =
        "This ${3|is,isn't|} a ${1:complex} $2 ${2/is/, luckily/}.";

      expect(new SnippetList(text).serialize()).toBe(result);
    });

    it('should insert expansions', () => {
      const text = '${!expansion}';
      const expansion = 'This is an expansion';

      expect(
        new SnippetList(text, [
          { name: 'expansion', value: 'This is an expansion' }
        ]).serialize()
      ).toBe(expansion);
    });

    it('should increment expansion tabstops', () => {
      const text = '$1 $2 $3. ${!expansion}';
      const expansion = '$1 $2 $3. This is an expansion $4 $5 $6';
      let list = new SnippetList(text, [
        { name: 'expansion', value: 'This is an expansion $1 $2 $3' }
      ]);

      expect(list.tabstops).toHaveLength(6);
      expect(list.tabstops.serialize()).toBe('1:$1 2:$2 3:$3 4:$1 5:$2 6:$3');
      expect(list.serialize()).toBe(expansion);
    });

    it('should increment tabstops after inserted expansion', () => {
      const text = '$1 $2 $3 $4. ${!expansion} $5 $6 $4';
      const expansion =
        '$1 $2 $3 $4. This is an expansion ${7:1} ${8:1} ${9:1}. This is another expansion ${10:2} ${11:2} ${12:2}. $5 $6 $4';
      let list = new SnippetList(text, [
        {
          name: 'expansion',
          value:
            'This is an expansion ${1:1} ${2:1} ${3:1}. ${!another expansion}'
        },
        {
          name: 'another expansion',
          value: 'This is another expansion ${1:2} ${2:2} ${3:2}.'
        }
      ]);

      expect(list.tabstops.serialize()).toBe(
        '1:$1 2:$2 3:$3 4:$4 4:$4 5:$5 6:$6 7:${1:1} 8:${2:1} 9:${3:1} 10:${1:2} 11:${2:2} 12:${3:2}'
      );
      expect(list.serialize()).toBe(expansion);
    });

    it('should handle multiple same level expansions', () => {
      const base = '${!first}. ${!second}. ${!third}. $1';
      let list = new SnippetList(base, [
        {
          name: 'first',
          value: 'First expansion ${1:1} ${2:1} ${3:1}'
        },
        {
          name: 'second',
          value: 'Second expansion ${1:2} ${2:2} ${3:2}'
        },
        {
          name: 'third',
          value: 'Last expansion ${1:3} ${2:3} ${3:3}'
        }
      ]);

      // expect(list.tabstops.serialize()).toBe('');
      expect(list.serialize()).toBe(
        'First expansion ${2:1} ${3:1} ${4:1}. Second expansion ${5:2} ${6:2} ${7:2}. Last expansion ${8:3} ${9:3} ${10:3}. $1'
      );
    });

    it('should replace dynamic functions with substitutions', () => {
      const ifText = '${#if TM_VAR:exists}';
      const ifConditionText = '${#if TM_VAR:yes:equals}';
      const unlessText = "${#unless TM_VAR:doesn't exist}";
      const unlessConditionText = "${#unless TM_VAR:no:doesn't equal}";

      expect(new SnippetList(ifText).serialize()).toBe(
        '${TM_VAR/(^.+$)/${1:+exists}/}'
      );
      expect(new SnippetList(ifConditionText).serialize()).toBe(
        '${TM_VAR/(yes)|(^.*?$)/${1:+equals}/}'
      );
      expect(new SnippetList(unlessText).serialize()).toBe(
        "${TM_VAR/(^.+$)|(^.*?$)/${1:? :doesn't exist}/}"
      );
      expect(new SnippetList(unlessConditionText).serialize()).toBe(
        "${TM_VAR/(no)|(^.*?$)/${1:? :doesn't equal}/}"
      );
    });
  });

  describe('insert()', () => {
    it('should insert SnippetList at the start of another list', () => {
      const firstListText = '$1 $2 $3';
      const secondListText = '${1:1} ${2:2} ${3:3}';
      const firstList = new SnippetList(firstListText);
      const secondList = new SnippetList(secondListText);

      firstList.splice(0, 0, ...secondList.toArray());

      expect(firstList.serialize()).toBe(`${secondListText}${firstListText}`);
    });

    it('should insert SnippetList in the middle of another list', () => {
      const firstListText = '$1 $2 $3';
      const secondListText = '${1:1} ${2:2} ${3:3}';
      const firstList = new SnippetList(firstListText);
      const secondList = new SnippetList(secondListText);

      // Snippetlist holds text nodes as well
      firstList.splice(2, 0, ...secondList.toArray());

      expect(firstList.serialize()).toBe('$1 ${1:1} ${2:2} ${3:3}$2 $3');
    });

    it('should insert SnippetList at the end of another list', () => {
      const firstListText = '$1 $2 $3';
      const secondListText = '${1:1} ${2:2} ${3:3}';
      const firstList = new SnippetList(firstListText);
      const secondList = new SnippetList(secondListText);

      firstList.push(...secondList.toArray());

      expect(firstList.serialize()).toBe(`${firstListText}${secondListText}`);
    });
  });
});
