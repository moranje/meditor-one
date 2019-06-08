import { SnippetParser } from '@/components/_Shared/Editor/snippet/parser'
import { format } from 'date-fns'
import context from './context.stub'
import Expansion from '../classes/expansion'

function parse(input, hasContext?: boolean) {
  let localContext = hasContext ? context : {}
  return () => {
    let parser = new SnippetParser(localContext).parse(input)

    // expect(parser).toMatchSnapshot()

    expect(`${parser}`).toBe(input)
  }
}

function transform(input, expected, hasContext?: boolean) {
  let localContext = hasContext ? context : {}
  return () => {
    let parser = new SnippetParser(localContext).parse(input)

    expect(`${parser.root.toText()}`).toBe(expected)
  }
}

describe('Unit: Parser', () => {
  // *****************************
  // TEXT
  // *****************************

  it('should parse and unparse zero-length string', parse(''))

  it(
    'should transform zero-length string to zero-length string',
    transform('', '')
  )

  it('should parse and unparse simple text', parse('One'))

  it('should transform text to the original input', transform('One', 'One'))

  // *****************************
  // COMMENT
  // *****************************

  it('should parse and unparse comment', parse('# This is a comment'))

  it(
    'should transform comments out of the text',
    transform('# This is a comment', '')
  )

  it(
    'should parse and unparse comment and the first newline character',
    parse('# This is a comment\n\nThis is some text')
  )

  it(
    'should transform comments and the first newline character out of the text',
    transform('# This is a comment\n\nThis is some text', '\nThis is some text')
  )

  // *****************************
  // PLACEHOLDER
  // *****************************

  it('should parse and unparse simple placeholder', parse('$1'))

  it('should transform simple placeholder to empty string', transform('$1', ''))

  it('should parse and unparse named simple placeholder', parse('$2<name>'))

  it(
    'should transform named simple placeholder to empty string',
    transform('$2<name>', '')
  )

  it('should parse and unparse placeholder block', parse('${3}'))

  it(
    'should transform placeholder block to empty string',
    transform('${3}', '')
  )

  it('should parse and unparse named placeholder block', parse('${4<name>}'))

  it(
    'should transform named placeholder block to empty string',
    transform('${4<name>}', '')
  )

  it(
    'should parse and unparse placeholder block with argument',
    parse('${5:placeholder}')
  )

  it(
    'should transform placeholder block with argument to argument string',
    transform('${5:placeholder}', 'placeholder')
  )

  it(
    'should parse and unparse named placeholder block with argument',
    parse('${6<name>:placeholder}')
  )

  it(
    'should transform named placeholder block with argument to argument string',
    transform('${6<name>:placeholder}', 'placeholder')
  )

  it(
    'should parse and unparse placeholder block with marker arguments',
    parse('${7:$1 $50<name> ${2:placeholder}}')
  )

  it(
    'should transform placeholder block with marker argument to argument string',
    transform('${7:$1 $50<name> ${2:placeholder}}', '  placeholder')
  )

  it(
    'should parse and unparse named placeholder block with marker argument',
    parse('${8<name>:$1 $50<name> ${2:placeholder}}')
  )

  it(
    'should transform named placeholder block with marker argument to argument string',
    transform('${8<name>:$1 $50<name> ${2:placeholder}}', '  placeholder')
  )

  // *****************************
  // CHOICE
  // *****************************

  it('should parse and unparse choice', parse('${1|One,Two,Three|}'))

  it(
    'should transform choice to first option by default',
    transform('${1|One,Two,Three|}', 'One')
  )

  it(
    'should parse and unparse choice with empty first argument',
    parse('${1|,Four,Five|}')
  )

  it(
    'should transform choice with empty first argument to empty string',
    transform('${1|,Four,Five|}', '')
  )

  it(
    'should parse and unparse choice expansions',
    parse('${2|One,Two,${!1:expansion}|}')
  )

  it(
    "should transform choice expansion to an empty string by default (since it's unresolved by default)",
    transform('${2|One,Two,${!1:expansion}|}', 'One')
  )

  it(
    'should parse and unparse choice expansions',
    parse('${3|${!1:expansion},Two,Three|}')
  )

  it(
    "should transform choice expansion to an empty string by default (since it's unresolved by default)",
    transform('${3|${!1:expansion},Two,Three|}', '')
  )

  // *****************************
  // VARIABLE
  // *****************************

  it('should parse and unparse simple variable', parse('$name_W1thNum3r5'))

  it(
    'should transform simple variable to an empty string by default',
    transform('$name_W1thNum3r5', '')
  )

  it('should parse and unparse block variable', parse('${name_W2thNum3r5}'))

  it(
    'should transform block variable to an empty string by default',
    transform('${name_W2thNum3r5}', '')
  )

  it(
    'should parse and unparse block variable with arguments',
    parse('${name_W3thNum3r5:placeholder}')
  )

  it(
    'should transform block variable with arguments to an empty string by default',
    transform('${name_W3thNum3r5:placeholder}', 'placeholder')
  )

  it(
    'should parse and unparse named variable block with marker argument',
    parse('${name_W4thNum3r5:$1 $50<name> ${2:placeholder}}')
  )

  it(
    'should transform named variable block with marker argument to argument string',
    transform(
      '${name_W4thNum3r5:$1 $50<name> ${2:placeholder}}',
      '  placeholder'
    )
  )

  // *****************************
  // Transform
  // *****************************

  it(
    'should parse and unparse basic placeholder transform',
    parse('${1/(.*)/$1/}')
  )

  it(
    'should transform basic placeholder transform to an empty string by default',
    transform('${1/(.*)/$1/}', '')
  )

  it(
    'should parse and unparse basic variable transform',
    parse('${name/(.*)/$1/}')
  )

  it(
    'should transform basic variable transform to an empty string by default',
    transform('${name/(.*)/$1/}', '')
  )

  it(
    'should parse and unparse placeholder transform with replacement group block',
    parse('${1/(.*)/${1}/}')
  )

  it(
    'should transform placeholder transform with replacement group block to an empty string by default',
    transform('${1/(.*)/$1/}', '')
  )

  it(
    'should parse and unparse placeholder transform with uppercase modifier',
    parse('${1/(.*)/${1:/upcase}/}')
  )

  it(
    'should transform placeholder transform with uppercase modifier to an empty string by default',
    transform('${1/(.*)/${1:/upcase}/}', '')
  )

  it(
    'should parse and unparse placeholder transform with lowercase modifier',
    parse('${1/(.*)/${1:/downcase}/}')
  )

  it(
    'should transform placeholder transform with lowercase modifier to an empty string by default',
    transform('${1/(.*)/${1:/downcase}/}', '')
  )

  it(
    'should parse and unparse placeholder transform with capilazation modifier',
    parse('${1/(.*)/${1:/capitalize}/}')
  )

  it(
    'should transform placeholder transform with capilazation modifier to an empty string by default',
    transform('${1/(.*)/${1:/capitalize}/}', '')
  )

  it(
    'should parse and unparse placeholder transform if condition',
    parse('${1/(.*)/${1:+Show this when the group holds any value}/}')
  )

  it(
    'should transform placeholder transform if condition to an empty string by default',
    transform('${1/(.*)/${1:+Show this when the group holds any value}/}', '')
  )

  it(
    'should parse and unparse placeholder transform if-else condition',
    parse(
      "${1/(.*)/${1:?Show this when the group holds any value:Show this when the group doesn't hold any value}/}"
    )
  )

  it(
    'should transform placeholder transform if-else condition to an empty string by default',
    transform(
      "${1/(.*)/${1:?Show this when the group holds any value:Show this when the group doesn't hold any value}/}",
      "Show this when the group doesn't hold any value"
    )
  )

  it(
    'should parse and unparse placeholder transform else condition',
    parse('${1/(.*)/${1:+Show this when the group holds any value}/}')
  )

  it(
    'should transform placeholder transform else condition to an empty string by default',
    transform(
      "${1/(.*)/${1:-Show this when the group doesn't hold any value}/}",
      "Show this when the group doesn't hold any value"
    )
  )

  // *****************************
  // EXPANSION
  // *****************************

  it(
    'should parse and unparse an expansion with arguments',
    parse('${!1:my-expansion-snippet}')
  )

  it(
    'should transform an expansion with arguments to an empty string by default',
    transform('${!1:my-expansion-snippet}', '')
  )

  it(
    'should parse and unparse an expansion with arguments',
    parse(
      '${!1:my-expansion-snippet\n/1:Text\n/2:$100 : ${101:This as well}\n/3:last argument}'
    )
  )

  it(
    'should transform an expansion with arguments to an empty string by default',
    transform(
      '${!1:my-expansion-snippet\n/1:Text\n/2:$100 : ${101:This as well}\n/3:last argument\n}',
      ''
    )
  )

  it('should insert snippet expansions in place', () => {
    let snippet = '${!1:basic}'
    let parser = new SnippetParser(context).parse(snippet)

    expect(`${parser}`).toBe('This is an expansion')
  })

  it('should insert snippet expansions with slots in place', () => {
    let snippet =
      '${!1:with-slots\n/1:Secondly\n/2:do\n/3:insert\n/5:Try and paste this\n}'
    let parser = new SnippetParser(context).parse(snippet)

    expect(`${parser.root.toText()}`).toBe(
      'Try and paste this. And Secondly do an insert as well.'
    )
  })

  it('should insert nested snippet expansions in place', () => {
    let snippet = '${!1:first-nested}'
    let parser = new SnippetParser(context).parse(snippet)

    expect(`${parser}`).toBe(
      'Tabstop: $1. 2nd Level: $3. Final level: $5. And $4. Tabstop: $2.'
    )
  })

  it('should increment sibling expansion indices by amount of nested placeholder buckets', () => {
    let snippet =
      '${!1:placeholders} ${!2:placeholders} ${!3:placeholders} ${!4:placeholders}'
    let parser = new SnippetParser(context).parse(snippet)

    let indices = []
    parser.walk(parser.root.children, child => {
      if (child instanceof Expansion) {
        indices.push(child.index)
      }
      return true
    })

    expect(indices).toEqual([1, 4, 7, 10])
  })

  it('should insert parallel nested snippet expansions in place', () => {
    let snippet =
      '${!1:placeholders} ${!2:placeholders} ${!3:placeholders} ${!4:placeholders}'
    let parser = new SnippetParser(context).parse(snippet)

    expect(`${parser}`).toBe('$1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12')
  })

  it('should insert parallel nested snippet expansions in respect to the expansion indices (with may leave tabstop "holes")', () => {
    let snippet = '${!1:placeholders} ${!10:placeholders}'
    let parser = new SnippetParser(context).parse(snippet)

    expect(`${parser}`).toBe('$1 $2 $3 $12 $13 $14')
  })

  it('should insert increment affixing parent placeholder', () => {
    let snippet = '${!1:placeholders} $1'
    let parser = new SnippetParser(context).parse(snippet)

    expect(`${parser}`).toBe('$1 $2 $3 $4')
  })

  it('should insert increment prefixing parent placeholder', () => {
    let snippet = '$1 ${!1:placeholders}'
    let parser = new SnippetParser(context).parse(snippet)

    expect(`${parser}`).toBe('$4 $1 $2 $3')
  })

  // *****************************
  // SLOT
  // *****************************

  it('should parse and unparse slot', parse('$!1'))

  it(
    'should transform a slot to an empty string by default',
    transform('$!1', '')
  )

  // *****************************
  // ACTION
  // *****************************

  it('should parse and unparse action', parse('${#date}'))

  it(
    'should transform an action to an empty string by default',
    transform('${#date}', '')
  )

  it(
    'should parse and unparse action with arguments',
    parse('${#date:YY-MM-dd}')
  )

  it(
    'should transform an action with arguments to an empty string by default',
    transform('${#date:YY-MM-dd}', '')
  )

  it(
    'should transform an action with date context to date string',
    transform('${#date}', format(new Date(), 'dd-MM-yyyy'), true)
  )

  it(
    'should transform an action with argument and date context to date string',
    transform('${#date:dd/MM/yy}', format(new Date(), 'dd/MM/yy'), true)
  )

  it(
    'should transform an action with argument and time context (and escaped colons) to time string',
    transform('${#time:HH\\:mm}', format(new Date(), 'HH:mm'), true)
  )

  // *****************************
  // CONDITION
  // *****************************

  it(
    'should parse and unparse condition',
    parse('${1:=:value}|${2:!=:value}=${!3:expansion}')
  )

  it(
    'should transform a condition to an empty string by default',
    transform('${1:=:value}|${2:!=:value}=${!3:expansion}', '')
  )
})
