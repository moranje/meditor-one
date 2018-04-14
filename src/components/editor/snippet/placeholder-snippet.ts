import { Tabstop, TabstopList, SnippetList } from '.';

export default class Placeholder extends Tabstop {
  private _placeholder: SnippetList;
  constructor(template: string, parent?: SnippetList) {
    super(template, parent);

    this.type = 'placeholder';
    // this.text = template;
  }

  get text() {
    return `\${${this.tabstop}:${this.placeholder}}`;
  }

  get placeholder() {
    return this._placeholder.serialize();
  }

  set placeholder(placeholder) {
    this._placeholder = new SnippetList(placeholder);
  }

  parse(text: string = this.template) {
    this.comparator = +this.template.replace(/\$\{(\d+):[^}]*?\}/, '$1');
    this.placeholder = this.template.replace(/\$\{\d+:([^}]*?)\}/, '$1');
  }
}
