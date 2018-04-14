export default class Node {
  private _previous: Node;
  private _element: any;
  private _next: Node;
  private _siblings: any[] = [];
  constructor(previous, element, next) {
    this.previous = previous;
    this.next = next;
    this.element = element;
  }

  get index() {
    if (this.previous) {
      return this.previous.index + 1;
    } else {
      return 0;
    }
  }

  get element() {
    return this._element;
  }

  set element(element: any) {
    this._element = element;
  }

  get previous() {
    return this._previous;
  }

  set previous(previous: Node) {
    this._previous = previous;
  }

  get next() {
    return this._next;
  }

  set next(next: Node) {
    this._next = next;
  }

  get siblings(): any[] {
    return this._siblings;
  }

  setSiblings(siblings: any | any[]) {
    if (Array.isArray(siblings)) {
      this._siblings.push(...siblings);
    } else {
      this._siblings.push(siblings);
    }
  }
}
