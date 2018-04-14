import { Tabstop, SnippetList } from '.';

export default class Choice extends Tabstop {
  private _choice: string;
  constructor(template: string, parent?: SnippetList) {
    super(template, parent);

    this.type = 'choice';
  }

  get text() {
    return `\${${this.tabstop}|${this.choice}|}`;
  }

  get choice() {
    return this._choice;
  }

  set choice(choice: string) {
    this._choice = choice;
  }

  parse(text: string = this.template) {
    this.comparator = +this.template.replace(/\$\{(\d+)\|.*?\|\}/, '$1');
    this.choice = this.template.replace(/\$\{\d+\|(.*?)\|\}/, '$1');
  }
}
