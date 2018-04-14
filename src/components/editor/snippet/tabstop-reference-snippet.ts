import { isInteger } from 'lodash';
import { Text, Tabstop, SnippetList } from '.';

export default class TabstopReference extends Text {
  private _tabstopReference: number;
  private _reference: Tabstop;
  constructor(template: string, parent?: SnippetList) {
    super(template, parent);

    this.type = 'tabstop reference';

    this.parse();
  }

  get tabstopReference() {
    return this._tabstopReference;
  }

  set tabstopReference(tabstopReference) {
    if (isInteger(tabstopReference) && tabstopReference >= 0) {
      this._tabstopReference = tabstopReference;
    } else {
      throw new Error(
        `Property tabstopReference must be a positive integer, was ${tabstopReference}`
      );
    }
  }

  get reference() {
    return this._reference;
  }

  set reference(reference) {
    this._reference = reference;
  }

  parse() {
    if (this.type !== 'tabstop reference') {
      throw new Error('Subclasses of Tabstop must implement a parse function');
    }

    this.tabstopReference = +this.template.replace(/^\$(\d+)$/g, `$1`);
    this.reference = this.parent.tabstops.getNode(
      this.tabstopReference - 1
    ).value;
  }
}
