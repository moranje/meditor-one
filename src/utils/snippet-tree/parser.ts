import * as grammar from '@/utils/snippet-tree/grammar';
import nearley from 'nearley';

export default function(text: string) {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

  parser.feed(text);

  return parser.results;
}
