import { SnippetList } from '.';

export default class Text {
  private _template: string;
  type: string = 'text';
  parent: SnippetList;
  constructor(text = '', parent?: SnippetList) {
    this.template = text;
    this.parent = parent;
  }

  get length() {
    return this.text.length;
  }

  get template() {
    return this._template;
  }

  set template(value) {
    if (typeof value === 'string') {
      this._template = value;
    }
  }

  get text() {
    return this._template;
  }

  set text(value) {
    if (typeof value === 'string') {
      this._template = value;
    }
  }
}
