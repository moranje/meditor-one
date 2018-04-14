import LinkedList from '@/components/editor/linked-list';

describe('linked-list.ts', () => {
  it('should splice insert items', () => {
    let list = new LinkedList();
    expect(list).toHaveLength(0);

    list.splice(0, 0, 1);

    expect(list.toArray()).toEqual([1]);
    expect(list).toHaveLength(1);

    list.splice(1, 0, 3);

    expect(list.toArray()).toEqual([1,3]);
    expect(list).toHaveLength(2);

    list.splice(1, 0, 2);

    expect(list.toArray()).toEqual([1,2,3]);
    expect(list).toHaveLength(3);
  });

  it('should splice insert multiple items', () => {
    // @ts-ignore
    let list = new LinkedList([1, 2, 3]);
    expect(list).toHaveLength(3);

    list.splice(3, 0, 7, 8, 9);

    expect(list.toArray()).toEqual([1, 2, 3, 7, 8, 9]);
    expect(list).toHaveLength(6);

    list.splice(3, 0, 4, 5, 6);

    expect(list.toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(list).toHaveLength(9);
  });

  it('should splice delete items', () => {
    // @ts-ignore
    let list = new LinkedList([1, 2, 3]);

    list.splice(1, 1, 8);

    expect(list.toArray()).toEqual([1, 8, 3]);

    list.splice(0, 1, 7);

    expect(list.toArray()).toEqual([7, 8, 3]);

    list.splice(2, 1, 9);

    expect(list.toArray()).toEqual([7, 8, 9]);
  });

  it('should splice delete multiple items', () => {
    // @ts-ignore
    let list = new LinkedList([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(list).toHaveLength(9);

    list.splice(3, 3);

    expect(list.toArray()).toEqual([1, 2, 3, 7, 8, 9]);
    expect(list).toHaveLength(6);

    list.splice(3, 3);

    expect(list.toArray()).toEqual([1, 2, 3]);
    expect(list).toHaveLength(3);

    list.splice(0, 3);

    expect(list.toArray()).toEqual([]);
    expect(list).toHaveLength(0);
  });

  it('should retrieve nodes with getNode()', () => {
    // @ts-ignore
    let list = new LinkedList([1, 14, 3]);

    let first = list.getNode(0);
    let second = list.getNode(1);
    let third = list.getNode(2);

    expect(first.value).toBe(1);
    expect(second.value).toBe(14);
    expect(third.value).toBe(3);
  });

  describe('Class Node:', () => {
    it('should keep index references', () => {
      // @ts-ignore
      let list = new LinkedList([1, 2, 3]);

      let first = list.getNode(0);
      let second = list.getNode(1);
      let third = list.getNode(2);

      expect(first.index).toBe(0);
      expect(second.index).toBe(1);
      expect(third.index).toBe(2);
    });

    it('should have correct index reference after insertion of another list', () => {
      // @ts-ignore
      let list = new LinkedList([1, 2, 3]);
      // @ts-ignore
      let secondList = new LinkedList([4, 5, 6]);

      list.push(secondList.toArray());

      list.forEach((value, i) => {
        const node = list.getNode(i);

        expect(node.index).toBe(i);
      });
    });
  });
});
