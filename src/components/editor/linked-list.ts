function push(self, item) {
  self.tail = new Node(item, self.tail, null, self);
  if (!self.head) {
    self.head = self.tail;
  }

  self.length++;
}

function unshift(self, item) {
  self.head = new Node(item, null, self.head, self);
  if (!self.tail) {
    self.tail = self.head;
  }

  self.length++;
}

function insert(index, item, self) {
  if (index >= self.length) {
    self.push(item);
  } else {
    const after = self.getNode(index);
    const before = self.getNode(index - 1);
    const node = new Node(item, before, after, self);

    if (!after) {
      self.tail = node;
    } else {
      after.previous = node;
    }

    if (!before) {
      self.head = node;
    } else {
      before.next = node;
    }

    self.length++;
  }
}

export class Node {
  _value: any[];
  next: Node;
  prev: Node;
  list: LinkedList;
  constructor(value = [], prev, next, list) {
    if (!(this instanceof Node)) {
      return new Node(value, prev, next, list);
    }

    this.list = list;
    this._value = [];
    this.value = value;

    if (prev) {
      prev.next = this;
      this.prev = prev;
    } else {
      this.prev = null;
    }

    if (next) {
      next.prev = this;
      this.next = next;
    } else {
      this.next = null;
    }
  }

  get index() {
    if (this.prev) {
      return this.prev.index + 1;
    } else {
      return 0;
    }
  }

  get value() {
    return this._value[0];
  }

  set value(value: any) {
    if (Array.isArray(value)) {
      throw new Error('Value node value must not be an array');
    }

    if (this._value.length === 0) {
      this._value.push(value);
    } else {
      this._value.shift();
      this._value.unshift(value);
    }
  }

  get siblings(): any[] {
    return this._value.slice(1);
  }

  set siblings(sibs: any[]) {
    this._value.push(...sibs);
  }
}

export default class LinkedList {
  head: Node;
  tail: Node;
  length: number;
  constructor(list?: LinkedList) {
    let self: LinkedList = this;
    if (!(self instanceof LinkedList)) {
      self = new LinkedList();
    }

    self.tail = null;
    self.head = null;
    self.length = 0;

    if (list && typeof list.forEach === 'function') {
      list.forEach(item => {
        self.push(item);
      });
    } else if (arguments.length > 0) {
      for (let i = 0, l = arguments.length; i < l; i++) {
        self.push(arguments[i]);
      }
    }

    return self;
  }

  [Symbol.iterator] = function*() {
    for (let walker = this.head; walker; walker = walker.next) {
      yield walker.value;
    }
  };

  removeNode(node) {
    if (node.list !== this) {
      throw new Error('removing node which does not belong to this list');
    }

    const next = node.next;
    const prev = node.prev;

    if (next) {
      next.prev = prev;
    }

    if (prev) {
      prev.next = next;
    }

    if (node === this.head) {
      this.head = next;
    }
    if (node === this.tail) {
      this.tail = prev;
    }

    node.list.length--;
    node.next = null;
    node.prev = null;
    node.list = null;
  }

  unshiftNode(node) {
    if (node === this.head) {
      return;
    }

    if (node.list) {
      node.list.removeNode(node);
    }

    const head = this.head;
    node.list = this;
    node.next = head;
    if (head) {
      head.prev = node;
    }

    this.head = node;
    if (!this.tail) {
      this.tail = node;
    }
    this.length++;
  }

  pushNode(node) {
    if (node === this.tail) {
      return;
    }

    if (node.list) {
      node.list.removeNode(node);
    }

    const tail = this.tail;
    node.list = this;

    node.prev = tail;
    if (tail) {
      tail.next = node;
    }

    this.tail = node;
    if (!this.head) {
      this.head = node;
    }

    this.length++;
  }

  push(...args: any[]) {
    if (Array.isArray(args[0])) args = args[0];

    for (let i = 0, l = args.length; i < l; i++) {
      push(this, args[i]);
    }
    return this.length;
  }

  unshift(...args: any[]) {
    if (Array.isArray(args[0])) args = args[0];

    for (let i = 0, l = args.length; i < l; i++) {
      unshift(this, args[i]);
    }
    return this.length;
  }

  pop() {
    if (!this.tail) {
      return undefined;
    }

    const res = this.tail.value;
    this.tail = this.tail.prev;
    if (this.tail) {
      this.tail.next = null;
    } else {
      this.head = null;
    }
    this.length--;
    return res;
  }

  shift() {
    if (!this.head) {
      return undefined;
    }

    const res = this.head.value;
    this.head = this.head.next;
    if (this.head) {
      this.head.prev = null;
    } else {
      this.tail = null;
    }
    this.length--;
    return res;
  }

  forEach(fn, thisp = this) {
    for (let walker = this.head, i = 0; walker !== null; i++) {
      fn.call(thisp, walker.value, i, this);
      walker = walker.next;
    }
  }

  forEachReverse(fn, thisp = this) {
    for (let walker = this.tail, i = this.length - 1; walker !== null; i--) {
      fn.call(thisp, walker.value, i, this);
      walker = walker.prev;
    }
  }

  get(n) {
    for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
      // abort out of the list early if we hit a cycle
      walker = walker.next;
    }
    if (i === n && walker !== null) {
      return walker.value;
    }
  }

  getReverse(n) {
    for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
      // abort out of the list early if we hit a cycle
      walker = walker.prev;
    }
    if (i === n && walker !== null) {
      return walker.value;
    }
  }

  getNode(n) {
    for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
      // abort out of the list early if we hit a cycle
      walker = walker.next;
    }
    if (i === n && walker !== null) {
      return walker;
    }
  }

  getNodeReverse(n) {
    for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
      // abort out of the list early if we hit a cycle
      walker = walker.prev;
    }
    if (i === n && walker !== null) {
      return walker;
    }
  }

  map(fn, thisp = this) {
    const res = new LinkedList();
    for (let walker = this.head; walker !== null; ) {
      res.push(fn.call(thisp, walker.value, this));
      walker = walker.next;
    }
    return res;
  }

  mapReverse(fn, thisp = this) {
    const res = new LinkedList();
    for (let walker = this.tail; walker !== null; ) {
      res.push(fn.call(thisp, walker.value, this));
      walker = walker.prev;
    }
    return res;
  }

  reduce(fn, initial) {
    let acc;
    let walker = this.head;

    if (arguments.length > 1) {
      acc = initial;
    } else if (this.head) {
      walker = this.head.next;
      acc = this.head.value;
    } else {
      throw new TypeError('Reduce of empty list with no initial value');
    }

    for (let i = 0; walker !== null; i++) {
      acc = fn(acc, walker.value, i);
      walker = walker.next;
    }

    return acc;
  }

  reduceReverse(fn, initial) {
    let acc;
    let walker = this.tail;
    if (arguments.length > 1) {
      acc = initial;
    } else if (this.tail) {
      walker = this.tail.prev;
      acc = this.tail.value;
    } else {
      throw new TypeError('Reduce of empty list with no initial value');
    }

    for (let i = this.length - 1; walker !== null; i--) {
      acc = fn(acc, walker.value, i);
      walker = walker.prev;
    }

    return acc;
  }

  toArray() {
    const arr = new Array(this.length);
    for (let i = 0, walker = this.head; walker !== null; i++) {
      arr[i] = walker.value;
      walker = walker.next;
    }
    return arr;
  }

  toArrayReverse() {
    const arr = new Array(this.length);
    for (let i = 0, walker = this.tail; walker !== null; i++) {
      arr[i] = walker.value;
      walker = walker.prev;
    }
    return arr;
  }

  slice(from, to = this.length) {
    if (to < 0) {
      to += this.length;
    }
    from = from || 0;

    if (from < 0) {
      from += this.length;
    }

    const ret = new LinkedList();

    if (to < from || to < 0) {
      return ret;
    }

    if (from < 0) {
      from = 0;
    }

    if (to > this.length) {
      to = this.length;
    }

    for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
      walker = walker.next;
    }

    for (; walker !== null && i < to; i++, walker = walker.next) {
      ret.push(walker.value);
    }

    return ret;
  }

  sliceReverse(from, to = this.length) {
    if (to < 0) {
      to += this.length;
    }

    from = from || 0;
    if (from < 0) {
      from += this.length;
    }

    const ret = new LinkedList();
    if (to < from || to < 0) {
      return ret;
    }

    if (from < 0) {
      from = 0;
    }

    if (to > this.length) {
      to = this.length;
    }

    for (
      var i = this.length, walker = this.tail;
      walker !== null && i > to;
      i--
    ) {
      walker = walker.prev;
    }

    for (; walker !== null && i > from; i--, walker = walker.prev) {
      ret.push(walker.value);
    }
    return ret;
  }

  splice(start: number, deleteCount, ...items) {
    let first = true;

    this.forEach((value, index) => {
      if (index === start) {
        first = false;

        // Remove node's
        for (let i = deleteCount; i > 0; i--) {
          this.removeNode(this.getNode(start));
        }

        items.forEach((item, i) => {
          insert(index + i, item, this);
        });
      }
    });

    if (first) {
      this.push(items);
    }
  }

  reverse() {
    const head = this.head;
    const tail = this.tail;
    for (let walker = head; walker !== null; walker = walker.prev) {
      const p = walker.prev;
      walker.prev = walker.next;
      walker.next = p;
    }
    this.head = tail;
    this.tail = head;
    return this;
  }

  indexOf(searchElement) {
    let index = -1;

    this.forEach((value, i) => {
      // Object match
      if (value == searchElement) {
        index = i;

        return false;
      }
    });

    return index;
  }
}
