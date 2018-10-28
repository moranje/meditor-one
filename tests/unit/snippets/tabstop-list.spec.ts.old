import {
  TabstopList,
  Tabstop,
  Placeholder,
  SnippetList
} from '@/components/editor/snippet';

describe('tabstop-list.ts', () => {
  describe('Adding tabstops', () => {
    it('should be possible on an empty list', () => {
      let list = new TabstopList();
      let tabstop = new Tabstop('$1');

      list.addTabstop(tabstop);

      expect(list.head.value).toEqual(tabstop);
      expect(list.tail.value).toEqual(tabstop);
    });

    it('should add tabstops in the coorect order', () => {
      let first = new Tabstop('$1');
      let second = new Tabstop('$4');
      let third = new Tabstop('$3');
      let fourth = new Tabstop('$2');
      let list = new TabstopList();

      // Add tabstops
      list.addTabstop(first);
      expect(list.serialize()).toBe('1:$1');

      list.addTabstop(second);
      expect(list).toHaveLength(2);
      expect(list.serialize()).toBe('1:$1 2:$4');

      list.addTabstop(third);
      expect(list.serialize()).toBe('1:$1 2:$3 3:$4');

      list.addTabstop(fourth);
      expect(list.serialize()).toBe('1:$1 2:$2 3:$3 4:$4');
    });

    it('should bundle existing tabstops', () => {
      let first = new Tabstop('$1');
      let second = new Placeholder('${1:placholder}');
      let list = new TabstopList();

      list.addTabstop(first);
      expect(list.serialize()).toBe('1:$1');

      list.addTabstop(second);
      expect(list.serialize()).toBe('1:$1 1:${1:placholder}');
      expect(list.head.siblings).toHaveLength(1);

      list.addTabstop(first);
      expect(list.serialize()).toBe('1:$1 1:${1:placholder} 1:$1');
      expect(list).toHaveLength(1);
      expect(list.head.siblings).toHaveLength(2);
    });

    it('should increment bundled tabstops', () => {
      let first = new Tabstop('$2');
      let second = new Placeholder('${2:placholder}');
      let third = new Tabstop('$1');
      let list = new TabstopList();

      list.addTabstop(first);
      expect(list.serialize()).toBe('1:$2');

      list.addTabstop(second);
      expect(list.serialize()).toBe('1:$2 1:${2:placholder}');
      expect(list.head.siblings).toHaveLength(1);

      list.addTabstop(third);
      expect(list.serialize()).toBe('1:$1 2:$2 2:${2:placholder}');
      expect(list).toHaveLength(2);
    });
  });

  it('should push TabstopList correctly', () => {
    let firstTabstopList = new TabstopList();
    let secondTabstopList = new SnippetList('${1:1} ${2:1} ${3:1}').tabstops;

    expect(firstTabstopList).toHaveLength(0);
    expect(firstTabstopList.serialize()).toBe('');
    expect(secondTabstopList).toHaveLength(3);
    expect(secondTabstopList.serialize()).toBe('1:${1:1} 2:${2:1} 3:${3:1}');

    firstTabstopList.push(secondTabstopList.toArray());
    expect(firstTabstopList).toHaveLength(3);
    expect(firstTabstopList.serialize()).toBe('1:${1:1} 2:${2:1} 3:${3:1}');
    expect(secondTabstopList).toHaveLength(3);
    expect(secondTabstopList.serialize()).toBe('1:${1:1} 2:${2:1} 3:${3:1}');
  });
});
