import { Text, SnippetList } from '.';

export default class SnippetFunction extends Text {
  type: string;
  transform: string;
  constructor(template, parent?: SnippetList) {
    super(template, parent);

    this.type = 'function';

    this.parse();
  }

  parse() {
    throw new Error('Method parse must be implemented by child classes');
  }
}
