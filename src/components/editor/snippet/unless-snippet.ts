import { SnippetFunction } from '.';

export default class Unless extends SnippetFunction {
  tabstopReference: number;
  variable: string;
  replacement: string;
  constructor(text, type) {
    super(text, type);

    this.type = 'unless';
  }

  get transform() {
    let variable = this.variable || this.tabstopReference;

    return `\${${variable}/(^.+$)|(^.*?$)/\${1:? :${this.replacement}}/}`;
  }

  parse() {
    this.tabstopReference = +this.template.replace(
      /\$\{#unless ([0-9]+):[^:}]+\}/,
      `$1`
    );
    this.variable = this.template.replace(
      /\$\{#unless ([a-zA-Z_]+):[^:}]+\}/,
      `$1`
    );
    this.replacement = this.template.replace(
      /\$\{#unless [0-9a-zA-Z_]+:([^:}]+)\}/,
      `$1`
    );
  }
}
