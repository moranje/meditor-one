import Node from './node';
import { Text, Tabstop, TabstopList } from './snippet';

export default class LinkedList {
  head: Node;
  tail: Node;
  constructor(elements?: any) {
    this.head = null;
    this.tail = null;

    this.insertAll(elements || []);
  }

  [Symbol.iterator]() {
    let index = -1;

    return {
      next: () => {
        return {
          value: this.getAt(++index),
          done: index === this.length
        };
      }
    };
  }

  get length() {
    if (!this.tail) return 0;

    // let length = 0;
    // this.forEach(() => {
    //   length += 1;
    // });

    return this.tail.index + 1;
    // return length;
  }

  shift() {
    if (!this.head) throw new Error('No such element!');

    this.head = this.head.next;

    if (this.head) {
      this.head.previous = null;
    } else {
      this.tail = null;
    }

    return this.head.element;
  }

  pop() {
    if (!this.tail) throw new Error('No such element!');

    this.tail = this.tail.previous;

    if (this.tail) {
      this.tail.next = null;
    } else {
      this.head = null;
    }

    return this.tail.element;
  }

  unshift(element: any) {
    const node = new Node(null, element, this.head);

    if (this.head) {
      this.head.previous = node;
    } else {
      this.tail = node;
    }

    this.head = node;
  }

  push(element: any) {
    const node = new Node(this.tail, element, null);

    if (this.tail) {
      this.tail.next = node;
    } else {
      this.head = node;
    }

    this.tail = node;
  }

  insert(element: any, index: number = this.length) {
    this._insertAt(index, element);
  }

  insertAll(elements: any[] | LinkedList, index: number = this.length) {
    if (elements instanceof LinkedList) {
      this._insertListAt(index, elements);
    } else {
      this._insertAllAt(index, elements);
    }
  }

  clear() {
    this.head = null;
    this.tail = null;
  }

  find(match: string | boolean | number | RegExp, property: string) {
    let found = null;

    this.forEach(element => {
      // Property match
      if (element[property] === match) {
        found = element;

        return false;
      }

      // Regex match
      if (
        typeof element[property] === 'string' &&
        element[property].test(match)
      ) {
        found = element;

        return false;
      }
    });

    return found;
  }

  getNode(index: number): Node {
    let reverse = index > this.length / 2;
    let found = null;

    this.forEach((element, i, node) => {
      if (i === index) found = node;
    }, reverse);

    return found;
  }

  getAt(index: number) {
    const node = this.getNode(index);

    return node.element;
  }

  setAt(index: number, element: any) {
    const node = this.getNode(index);
    const $element = node.element;

    node.element = element;

    return $element;
  }

  removeAt(index: number) {
    const node = this.getNode(index);

    return this._remove(node);
  }

  indexOf(match: any, property?: string) {
    let index = -1;

    this.forEach((element, i) => {
      // Object match
      if (element == match) {
        index = i;

        return false;
      }

      // Property match
      if (property && element[property] === match) {
        index = i;

        return false;
      }

      // Regex match
      if (
        property &&
        typeof element[property] === 'string' &&
        element[property].test(match)
      ) {
        index = i;

        return false;
      }
    });

    return index;
  }

  forEach(
    callback: (value: any, index: number, node: Node) => void,
    reverse: boolean = false
  ) {
    let advance;

    if (reverse) {
      let node = this.tail;
      let index = this.length;

      while (node && advance !== false) {
        index--;

        advance = callback(node.element, index, node);

        node = node.previous;
      }
    } else {
      let node = this.head;
      let index = -1;

      while (node && advance !== false) {
        index++;

        advance = callback(node.element, index, node);

        node = node.next;
      }
    }
  }

  lastIndexOf(element: any) {
    let index = this.length;
    let node = this.tail;

    while (node != null) {
      index--;

      if (node.element == element) {
        return index;
      }

      node = node.previous;
    }

    return -1;
  }

  includes(element: any) {
    return this.indexOf(element) !== -1;
  }

  // toString() {
  //   return [...this];
  // }

  private _remove(node: Node) {
    const element = node.element;
    const next = node.next;
    const previous = node.previous;

    if (!previous) {
      this.head = next;
    } else {
      previous.next = null;
      node.previous = null;
    }

    if (!next) {
      this.tail = previous;
    } else {
      next.previous = previous;
      node.next = null;
    }

    return element;
  }

  private _insertAt(index: number, element: any) {
    if (index >= this.length) {
      this.push(element);
    } else {
      const node = this.getNode(index);

      this._insertBefore(element, node);
    }
  }

  private _insertAllAt(index: number, elements: any[]) {
    elements.forEach((element, elementIndex) => {
      this._insertAt(index + elementIndex, element);
    });
  }

  private _insertListAt(index: number, list: LinkedList) {
    if (!list || list.length === 0) {
      new Error("Can't insert an empty or invalid list");
    }

    let nodeBefore = this.getNode(index - 1);
    let nodeAfter = this.getNode(index);

    if (index <= 0) {
      // Attach list to the front
      if (this.length > 0) {
        list.tail.next = nodeAfter;
        if (nodeAfter !== null) {
          nodeAfter.previous = list.tail;
        }
      }

      this.head = list.head;
    } else if (index >= this.length - 1) {
      // Attach list to the back
      if (this.length > 0) {
        list.head.previous = nodeBefore;
        if (nodeBefore !== null) {
          nodeBefore.next = list.head;
        }
      }

      this.tail = list.tail;
    } else {
      // Attach list in the middle
      list.tail.next = nodeAfter;
      if (nodeAfter !== null) {
        nodeAfter.previous = list.tail;
      }

      list.head.previous = nodeBefore;
      if (nodeBefore !== null) {
        nodeBefore.next = list.head;
      }
    }
  }

  private _insertNewNodes(elements: any[], previous: Node) {
    for (const element of elements) {
      previous = this._insertNewNode(element, previous);
    }

    return previous;
  }

  private _insertNewNode(element: any, previous: Node) {
    const node = new Node(previous, element, null);

    if (!previous) {
      this.head = node;
    } else {
      previous.next = node;
    }

    return node;
  }

  private _insertBefore(element: any, next: Node) {
    const previous = next && next.previous;
    const node = new Node(previous, element, next);

    next.previous = node;

    if (!previous) {
      this.head = node;
    } else {
      previous.next = node;
    }
  }
}
