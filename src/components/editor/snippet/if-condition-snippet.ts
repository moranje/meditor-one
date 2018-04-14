import { SnippetFunction } from '.';

export default class IfCondition extends SnippetFunction {
  tabstopReference: number;
  variable: string;
  pattern: RegExp;
  replacement: string;
  constructor(text, type) {
    super(text, type);

    this.type = 'if condition';
  }

  get transform() {
    let variable = this.variable || this.tabstopReference;

    return `\${${variable}/(${this.pattern.source})|(^.*?$)/\${1:+${
      this.replacement
    }}/}`;
  }

  parse(text = this.text) {
    this.tabstopReference = +this.template.replace(
      /\$\{#if ([0-9]+):[^:}]+:[^:}]+\}/,
      `$1`
    );
    this.variable = this.template.replace(
      /\$\{#if ([a-zA-Z_]+):[^:}]+:[^:}]+\}/,
      `$1`
    );
    this.pattern = new RegExp(
      this.template.replace(/\$\{#if [0-9a-zA-Z_]+:([^:}]+):[^:}]+\}/, `$1`)
    );
    this.replacement = this.template.replace(
      /\$\{#if [0-9a-zA-Z_]+:[^:}]+:([^:}]+)\}/,
      `$1`
    );
  }
}
