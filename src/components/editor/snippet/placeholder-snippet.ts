import { Tabstop, TabstopList, SnippetList } from '.';

export default class Placeholder extends Tabstop {
  private _placeholder: SnippetList;
  constructor(template: string, parent?: SnippetList) {
    super(template, parent);

    this.type = 'placeholder';
  }

  get text() {
    return `\${${this.tabstop}:${this.placeholder}}`;
  }

  get placeholder() {
    return `${this._placeholder}`;
  }

  set placeholder(placeholder) {
    this._placeholder = new SnippetList(placeholder);
  }

  get nested() {
    return this._placeholder;
  }

  parse() {
    this.comparator = +super.template.replace(/\$\{(\d+):[\s\S]*\}/, '$1');
    this.placeholder = this.template.replace(/\$\{\d+:([\s\S]*)\}/, '$1');

    if (Number.isNaN(this.comparator)) debugger;
  }
}
