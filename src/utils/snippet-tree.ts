import { AST } from '@/utils/snippet-tree/ast';
import parser from '@/utils/snippet-tree/parser';

/**
 * Parse tokens to an AST
 *
 * @author moranje
 * @param {string} text
 * @returns {AST}
 */
export function parse(text: string, context?) {
  if (text && text.length === 0) {
    throw new Error(
      `Text should at least have a single character but was ${text}`
    );
  }

  return new AST(parser(text), context).expand().ast;
}

/**
 * Validate snippet text
 *
 * @author moranje
 * @export
 * @param {string} text
 * @param {*} [context]
 * @returns
 */
export function validate(text: string, context?) {
  if (text && text.length === 0) {
    throw new Error(
      `Text should at least have a single character but was ${text}`
    );
  }
  let errors;

  try {
    let parsed = parser(text);
    errors = new AST(parsed, context).expand().errors;
  } catch (err) {
    if (err.message.match(/invalid syntax/)) {
      let line = +err.message.replace(/[\s\S]*line (\d+)[\s\S]*/, '$1');
      let col = +err.message.replace(/[\s\S]*col (\d+)[\s\S]*/, '$1');
      let message = err.message.split('\n');
      // Remove first line
      message.shift();

      errors = [
        {
          startLineNumber: line,
          startColumn: col,
          endLineNumber: line,
          endColumn: col + 1,
          message: `Oops! That looks like a typo:\n${message.join('\n')}`,
          severity: 8
        }
      ];
    }
  }

  return errors;
}
