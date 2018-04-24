import { isInteger, find } from 'lodash';
import { Text, SnippetList } from '.';

export default class Expansion extends Text {
  private _snippetReference: string;
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

  parse(text: string = this.template) {
    this.snippetReference = this.template.replace(/\$\{!(.*?)\}/, '$1');
  }

  expand(references = this.parent.references): SnippetList | null {
    const reference = find(references, ['name', this.snippetReference]);

    if (!reference) return null;

    return new SnippetList(reference.value, references);
  }
}
