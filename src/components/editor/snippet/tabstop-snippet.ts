import { isInteger } from 'lodash';
import { Text, SnippetList, TabstopList } from '.';
import { Node } from '@/components/editor/linked-list';
// import Text from './text-snippet';
// import SnippetList from './snippet-list';

export default class Tabstop extends Text {
  private _tabstop: number;
  private _group: number;
  private _comparator: number;
  private _node: Node;
  constructor(template: string, parent?: SnippetList) {
    super(template, parent);

    this.type = 'tabstop';

    this.parse();
  }

  get text() {
    return `$${this.tabstop}`;
  }

  set text(value: string) {
    super.text = value;
  }

  get tabstop() {
    if (!this.node) {
      console.log('no node defined in snippet');
      return this.comparator;
    }

    // Calculated tabstops
    return this.node.index + 1;
  }

  set tabstop(tabstop: number) {
    if (isInteger(tabstop) && tabstop >= 0) {
      this._tabstop = tabstop;
    } else {
      throw new Error(
        `Property tabstop must be a positive integer, was ${tabstop}`
      );
    }
  }

  get group() {
    if (!this._group) return 0;

    return this._group;
  }

  set group(group: number) {
    this._group = group;
  }

  get comparator() {
    return this._comparator;
  }

  set comparator(comparator: number) {
    if (typeof comparator === 'number') {
      this._comparator = comparator;
    } else {
      throw new Error(`Comparator must be a valid number, was ${comparator}`);
    }
  }

  get node() {
    return this._node;
  }

  set node(node: Node) {
    if (!node) {
      throw new Error('Not a valid node reference');
    }

    if (!(node.list instanceof TabstopList)) {
      throw new Error('Expected tabstop.node to refer to a TabstopList node');
    }

    this._node = node;
  }

  // Methods

  parse() {
    if (this.type !== 'tabstop') {
      throw new Error('Subclasses of Tabstop must implement a parse function');
    }

    this.comparator = +this.template.replace(/^\$(\d+)$/g, `$1`);
  }

  serialize() {
    return `${this.tabstop}:${this.template}`;
  }
}
