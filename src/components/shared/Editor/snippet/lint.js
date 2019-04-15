function snippet([$first, $rest]) {
  return new Snippet(
    null,
    [$first, ...[].concat(...$rest)].filter(element => element)
  )
}

function text([$text]) {
  let [first] = $text

  if (!first) {
    return new Text('') // TODO:  find a better way to catch this
  }

  return new Text($text.map(partial => partial.value).join(''))
}

function escaped([$escaped]) {
  // Unescape token, offsets the offset and col by 1
  return Object.assign($escaped, {
    value: $escaped.value.charAt(1)
  })
}

function comment([$comment]) {
  return new Comment($comment.value)
}

function placeholderSimple([$dollar, $int]) {}

function placeholderNamedSimple([
  $dollar,
  $namedInt,
  $openTag,
  $intName,
  $closeTag
]) {}

function placeholderBlock([$dollar, $open, $int, $close]) {}

function placeholderNamedBlock([
  $dollar,
  $open,
  $namedInt,
  $openTag,
  $intName,
  $closeTag,
  $close
]) {}

function placeholderBlockWithArg([
  $dollar,
  $open,
  $int,
  $colon,
  $snippet,
  $close
]) {}

function placeholderNamedBlockWithArg([
  $dollar,
  $open,
  $namedInt,
  $openTag,
  $intName,
  $closeTag,
  $colon,
  $snippet,
  $close
]) {}

function placeholderTransform([$dollar, $open, $int, $transform, $close]) {}

function choice() {}

function variableSimple() {}

function variableBlock() {}

function variableBlockWithArg() {}

function variableTransform() {}

function expansion() {}

function slot() {}

function action() {}

function placeholderExpression() {}

function variableExpression() {}

function result() {}

function transform() {}

function choiceOption() {}

function choiceOptionExpansion() {}
