import { SnippetFunction } from '.';

export default class If extends SnippetFunction {
  tabstopReference: number;
  variable: string;
  replacement: string;
  constructor(text, type) {
    super(text, type);

    this.type = 'if';
  }

  get transform() {
    let variable = this.variable || this.tabstopReference;

    return `\${${variable}/(^.+$)/\${1:+${this.replacement}}/}`;
  }

  parse(text = this.text) {
    this.tabstopReference = +this.template.replace(
      /\$\{#if ([0-9]+):[^:}]+\}/,
      `$1`
    );
    this.variable = this.template.replace(
      /\$\{#if ([a-zA-Z_]+):[^:}]+\}/,
      `$1`
    );
    this.replacement = this.template.replace(
      /\$\{#if [0-9a-zA-Z_]+:([^:}]+)\}/,
      `$1`
    );
  }
}
