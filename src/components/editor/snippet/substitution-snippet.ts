import { TabstopReference, SnippetList } from '.';
import { Node } from '@/components/editor/linked-list';

export default class Substitution extends TabstopReference {
  private _pattern: RegExp;
  private _replacement: string;
  private _modifier: string;
  constructor(template: string, parent?: SnippetList) {
    super(template, parent);
    this.type = 'substitution';
  }

  get text() {
    return `\${${this.tabstopReference}/${this.pattern.source}/${
      this.replacement
    }/${this.modifier}}`;
  }

  get pattern() {
    return this._pattern;
  }

  set pattern(pattern) {
    this._pattern = pattern;
  }

  get replacement() {
    return this._replacement;
  }

  set replacement(replacement) {
    this._replacement = replacement;
  }

  get modifier() {
    return this._modifier;
  }

  set modifier(modifier) {
    if (!modifier) {
      this._modifier = '';
    } else {
      this._modifier = modifier;
    }
  }

  parse() {
    this.tabstopReference = +this.template.replace(
      /^\$\{(\d+)\/.*?\/.*?\/[gmi]?\}$/g,
      `$1`
    );
    this.modifier = this.template.replace(
      /^\$\{\d+\/.*?\/.*?\/([gmi]?)\}$/g,
      `$1`
    );
    this.pattern = new RegExp(
      this.template.replace(/^\$\{\d+\/(.*?)\/.*?\/[gmi]?\}$/g, `$1`),
      this.modifier
    );
    this.replacement = this.template.replace(
      /^\$\{\d+\/.*?\/(.*?)\/([gmi]?)\}$/g,
      `$1`
    );

    this.reference = this.parent.tabstops.getNode(
      this.tabstopReference - 1
    ).value;
  }
}
