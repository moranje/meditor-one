import { Text, SnippetList } from '.';

export default class Incrementor extends Text {
  constructor(text, type) {
    super(text.replace('+', ''), type);
  }

  expand(references = this.parent.references): SnippetList | null {
    return new SnippetList(this.template.replace('+', ''), references);
  }
}
