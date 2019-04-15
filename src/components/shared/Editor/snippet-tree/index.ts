import { AST } from '@/components/Shared/Editor/snippet-tree/ast'
import parser from '@/components/Shared/Editor/snippet-tree/parser'

export function parse(text: string, context?) {
  if (text && text.length === 0) {
    throw new Error(
      `Text should at least have a single character but was ${text}`
    )
  }

  let ast = {}
  try {
    ast = new AST(parser(text), context).expand().ast
  } catch (error) {
    console.error(error)
  }

  return ast
}
