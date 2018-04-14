import { find } from 'lodash';
import factory, {
  Text,
  TabstopSnippet,
  Substitution,
  SnippetFunction
} from '.';

class Node {
  next: Node;
  prev: Node;
  value: Text;
  constructor(value, next = null, prev = null) {
    this.next = next;
    this.prev = prev;

    this.value = factory(value);
  }
}

function addHeadToNode(node, head, replace = false) {
  if (node.prev !== null) {
    node.prev.next = head;
  } // else node is first node and head will become the first node

  if (replace) {
    head.prev = node.prev;
  } else {
    head.prev = node;
  }
}

function addTailToNode(node, tail, replace = false) {
  if (node.next !== null) {
    node.next.prev = tail;
  } // else node is last node and tail will become the last node

  if (replace) {
    tail.next = node.next;
  } else {
    tail.next = node;
  }
}

function skipToPreviousNode(node: Node) {
  node.next = node.prev;
}

function skipToNextNode(node: Node) {
  node.prev = node.next;
}

function replaceNodeAt(node: Node, value: string, replace: boolean) {
  const newNode = new Node(value);

  addHeadToNode(node, newNode, replace);
  addTailToNode(node, newNode, replace);
}

function insertListAt(node: Node, list: LinkedList, replace: boolean) {
  addHeadToNode(node, list.head, replace);
  addTailToNode(node, list.tail, replace);
}

class LinkedList {
  head: Node;
  tail: Node;
  constructor() {
    this.head = null;
    this.tail = null;
  }

  get length() {
    let length = 0;

    this.iterate(node => length++);

    return length;
  }

  iterate(iterator, tail = false) {
    let node = tail ? this.tail : this.head;

    while (node) {
      const hasNext = tail ? node.prev !== null : node.next !== null;

      iterator(node, hasNext);

      // Iterate to next node
      node = tail ? node.prev : node.next;
    }
  }

  addToHead(value) {
    const node = new Node(value, this.head, null);

    if (this.head) {
      this.head.prev = node;
    } else {
      this.tail = node;
    }

    this.head = node;
  }

  addToTail(value) {
    const node = new Node(value, null, this.tail);

    if (this.tail) {
      this.tail.next = node;
    } else {
      this.head = node;
    }

    this.tail = node;
  }

  removeHead() {
    if (!this.head) return null;

    const value = this.head.value;
    this.head = this.head.next;

    if (this.head) {
      this.head.prev = null;
    } else {
      this.tail = null;
    }

    return value;
  }

  removeTail() {
    if (!this.tail) return null;

    const value = this.tail.value;
    this.tail = this.tail.prev;

    if (this.tail) {
      this.tail.next = null;
    } else {
      this.head = null;
    }

    return value;
  }
}

class ParsedText extends LinkedList {
  getLastTabstop() {
    let last = 0;

    this.iterate(node => {
      if (node.value instanceof TabstopSnippet && node.value.tabstop > last) {
        last = node.value.tabstop;
      }
    });

    return last;
  }

  insertExpansions(references) {
    this.iterate(node => {
      if (node.value.type === 'expansion') {
        const reference = find(references, ['name', node.value.reference]);

        if (reference) {
          const list = parse(reference.value); // eslint-disable-line
          const lastTabstop = list.getLastTabstop();

          // Update child tabstops
          list.incrementTabstopsBy(1, node.value.tabstop - 1);

          // Update parent tabstops
          this.incrementTabstopsBy(node.value.tabstop, lastTabstop);

          // Insert new nodes and go back an iteration search for newly
          // inserted expansions.
          insertListAt(node, list, true);
          skipToPreviousNode(node);
        }
      }
    });
  }

  insertDynamicFunctions() {
    this.iterate(node => {
      if (
        node.value instanceof SnippetFunction &&
        node.value.subtype === 'dynamic'
      ) {
        replaceNodeAt(node, node.value.transform, true);

        // Go back an iteration search for newly inserted expansions
        skipToPreviousNode(node);
      }
    });
  }

  incrementTabstopsBy(threshold, by) {
    this.iterate(node => {
      if (
        node.value instanceof TabstopSnippet &&
        node.value.type !== 'template' &&
        node.value.tabstop >= threshold
      ) {
        node.value.incrementBy(by);
      }
    });
  }

  serialize(): string {
    let serialized = '';

    this.iterate(node => {
      serialized += node.value.text;
    });

    return serialized;
  }

  compile(references = []): string {
    // Inserts expansions eg. ${!1:reference}
    this.insertExpansions(references);

    // Inserts function like ${#func }
    this.insertDynamicFunctions();

    return this.serialize();
  }
}

export default function parse(text) {
  const list = new ParsedText();
  const snippetRegex = /\$\d+|\$\{[^}]*?\}/g;
  let index = 0;
  let match = snippetRegex.exec(text);

  while (match !== null) {
    // Don't create text nodes for zero-length strings, unless text is
    // a zero-length string
    if (match.index > index) {
      list.addToTail(text.substring(index, match.index));
    }

    // Template node
    list.addToTail(text.substr(match.index, match[0].length));

    // Forward index
    index = match.index + match[0].length;
    match = snippetRegex.exec(text);
  }

  // Handle empty string case
  if (match === null && text.length === 0) {
    list.addToTail('');
  }

  // Add text node after last match
  if (index < text.length) {
    list.addToTail(text.substring(index, text.length));
  }

  return list;
}
