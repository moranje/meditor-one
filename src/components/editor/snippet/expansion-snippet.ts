import { isInteger, find } from 'lodash';
import { Text, SnippetList } from '.';

export default class Expansion extends Text {
  private _snippetReference: string;
  private _immediateExpansion: string;
  constructor(template: string, parent?: SnippetList) {
    super(template, parent);

    this.type = 'expansion';

    this.parse();
  }

  get text() {
    return '';
  }

  get snippetReference() {
    return this._snippetReference;
  }

  set snippetReference(snippetReference) {
    this._snippetReference = snippetReference;
  }

  get immediateExpansion() {
    return this._immediateExpansion;
  }

  set immediateExpansion(immediateExpansion) {
    this._immediateExpansion = immediateExpansion;
  }

  parse(text: string = this.template) {
    this.snippetReference = this.template.replace(/\$\{!(.*?)\}/, '$1');
    this.immediateExpansion = this.template.replace(
      /\$\{!(`)?(.+)\}/,
      (match, p1, p2) => {
        if (p1 === '`') return p2;

        return '';
      }
    );
  }

  expand(references = this.parent.references): SnippetList | null {
    if (this.immediateExpansion) {
      return new SnippetList(this.immediateExpansion, references);
    }

    const reference = find(references, ['name', this.snippetReference]);

    if (!reference) return null;

    return new SnippetList(reference.value, references);
  }
}
