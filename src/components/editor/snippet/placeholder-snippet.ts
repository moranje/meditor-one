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
    let references = this.parent ? this.parent.references : undefined;
    this._placeholder = new SnippetList(placeholder, references);
  }

  get nested() {
    return this._placeholder;
  }

  parse() {
    this.comparator = +super.template.replace(/\$\{(\d+):[\s\S]*\}/, '$1');
    this.placeholder = this.template.replace(/\$\{\d+:([\s\S]*)\}/, '$1');
  }
}
