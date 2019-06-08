@preprocessor typescript

@{%
import lexer from './lexer';

import {
  Action,
  Choice,
  Comment,
  Expansion,
  ExpansionArgument,
  Evaluation,
  FormatString,
  Placeholder,
  Condition,
  Slot,
  Snippet,
  Text,
  Transform,
  Variable
} from './classes';
%}

# Use moo tokenizer
@lexer lexer

# TODO: add rules for faulty patterns

Snippet ->
  Text:? (Element Text:?):* {% createSnippet %}

Element ->
  Placeholder {% id %}
  | Choice {% id %}
  | Variable {% id %}
  | Expansion {% id %}
  | Slot {% id %}
  | Action {% id %}
  | Condition {% id %}
  | Comment {% id %}
  # Should there be a catch all clause here to keep the parser from tripping?

Text ->
  TextPartial:* {% createText %}

TextPartial ->
  %text {% id %}
  | %newline {% id %}
  | %operator {% id %}
  | %equals {% id %}
  | %escape {% createEscaped %}

Comment ->
  %comment {% createComment %}

Placeholder ->
  %dollar %int {% createPlaceholderSimple %}
  | %dollar %namedInt %openTag %name %closeTag {% createPlaceholderNamedSimple %}
  | %dollar %open %int %close {% createPlaceholderBlock %}
  | %dollar %open %int %openTag %intName %closeTag %close {% createPlaceholderNamedBlock %}
  | %dollar %open %int %colon Snippet %close {% createPlaceholderBlockWithArgument %}
  | %dollar %open %int %openTag %intName %closeTag %colon Snippet %close {% createPlaceholderNamedBlockWithArgument %}
  | %dollar %open %int Transform %close {% createPlaceholderTransform %}

Choice ->
  %dollar %open %int %pipe ChoiceOption:? (%comma ChoiceOption):* %pipe %close {% createChoice %}

Variable ->
  %dollar %name {% createVariableSimple %}
  | %dollar %open %name %close {% createVariableBlock %}
  | %dollar %open %name %colon Snippet %close {% createVariableBlockWithArgument %}
  | %dollar %open %name Transform %close {% createVariableTransform %}

Expansion ->
   %dollar %open %exclamation %int %colon %name %close {% createExpansion %}
  | %dollar %open %exclamation %int %colon %name (ExpansionArgument {% id %}):+ %newline:? %close {% createExpansionWithArgument %}

Slot ->
  %dollar %exclamation (%name {% id %} | %int {% id %}) {% createSlot %}

Action ->
  %dollar %open %pound %name %close {% createAction %}
  | %dollar %open %pound %name (%colon TextArgument):+ %close {% createActionWithArguments %}

Condition ->
  Evaluation (%operator Evaluation):* %equals Expansion {% createCondition %}
  # Mayhaps allow Placeholder, Choice and Variable Elements?

Transform ->
  %slash %text %slash %text:? (FormatString %text:?):* %slash %text:? {% createTransform %}

FormatString ->
  %dollar %int {% createFormatStringSimple %}
  | %dollar %open %int %close {% createFormatStringBlock %}
  | %dollar %open %int %colon %caseModifier %close {% createFormatStringCaseModifier %}
  | %dollar %open %int %colon %plus %condition %close {% createFormatStringIfCondition %}
  | %dollar %open %int %colon %questionmark %condition %colon %condition %close {% createFormatStringIfElseCondition %}
  | %dollar %open %int %colon %minus:? %condition %close {% createFormatStringElseCondition %}

ChoiceOption ->
  Expansion {% id %}
  | TextArgument {% id %}

Evaluation ->
  %dollar %open %int %operatorColon %operator %colon TextArgument %close {% createPlaceholderEvaluation %}
  | %dollar %open %name %operatorColon %operator %colon TextArgument %close {% createVariableEvaluation %}

TextArgument ->
  TextArgumentPartial:* {% createText %}

TextArgumentPartial ->
  %text {% id %}
  | %escape {% createEscaped %}

ExpansionArgument ->
  %newline %slash (%name {% id %} | %int {% id %}) %colon Snippet {% createExpansionArgument %}

# *****************************************************************************
# FUNCTIONS
# *****************************************************************************

@{%
function createSnippet([$first, $rest]) {
  return new Snippet([$first, ...[].concat(...$rest)].filter(Boolean))
}

function createText([$text]) {
  let [first] = $text

  if (!first) {
    return
  }

  return new Text($text.map(partial => partial.value).join(''))
}

function createEscaped([$escaped]) {
  // Unescape token, offsets the offset and col by 1
  return Object.assign($escaped, {
    value: $escaped.value.charAt(1)
  })
}

function createComment([$comment]) {
  return new Comment($comment.value)
}

function createPlaceholderSimple([$dollar, $int]) {
  return new Placeholder(null, { index: +$int.value })
}

function createPlaceholderNamedSimple([
  $dollar,
  $int,
  $openTag,
  $name,
  $closeTag
]) {
  return new Placeholder(null, {
    index: +$int.value,
    name: $name.value
  })
}

function createPlaceholderBlock([$dollar, $open, $int, $close]) {
  return new Placeholder(null, { index: +$int.value, block: true })
}

function createPlaceholderNamedBlock([
  $dollar,
  $open,
  $int,
  $openTag,
  $name,
  $closeTag,
  $close
]) {
  return new Placeholder(null, {
    index: +$int.value,
    name: $name.value,
    block: true
  })
}

function createPlaceholderBlockWithArgument([
  $dollar,
  $open,
  $int,
  $colon,
  $Snippet,
  $close
]) {
  return new Placeholder([$Snippet], {
    index: +$int.value,
    block: true
  })
}

function createPlaceholderNamedBlockWithArgument([
  $dollar,
  $open,
  $int,
  $openTag,
  $name,
  $closeTag,
  $colon,
  $Snippet,
  $close
]) {
  return new Placeholder([$Snippet], {
    index: +$int.value,
    name: $name.value,
    block: true
  })
}

function createPlaceholderTransform([
  $dollar,
  $open,
  $int,
  $Transform,
  $close
]) {
  return new Placeholder(null, {
    index: +$int.value,
    block: true,
    transform: $Transform
  })
}

function createChoice([
  $dollar,
  $open,
  $int,
  $pipeOpen,
  $ChoiceOption,
  $ChoiceOptions,
  $pipeClose,
  $close
]) {
  if (!$ChoiceOption) {
    $ChoiceOption = new Text('')
  }

  return new Choice(
    [
      $ChoiceOption,
      ...$ChoiceOptions.map(([colon, choiceOption]) => choiceOption)
    ],
    {
      index: +$int.value
    }
  )
}

function createVariableSimple([$dollar, $name]) {
  return new Variable(null, {
    name: $name.value
  })
}

function createVariableBlock([$dollar, $open, $name, $close]) {
  return new Variable(null, {
    name: $name.value,
    block: true
  })
}

function createVariableBlockWithArgument([
  $dollar,
  $open,
  $name,
  $colon,
  $Snippet,
  $close
]) {
  return new Variable([$Snippet], {
    name: $name.value,
    block: true
  })
}

function createVariableTransform([$dollar, $open, $name, $Transform, $close]) {
  return new Variable(null, {
    name: $name.value,
    block: true,
    transform: $Transform
  })
}

function createExpansion([
  $dollar,
  $open,
  $exclamation,
  $int,
  $colon,
  $name,
  $close
]) {
  return new Expansion([], {
    index: +$int.value,
    name: $name.value
  })
}

function createExpansionWithArgument([
  $dollar,
  $open,
  $exclamation,
  $int,
  $colon,
  $name,
  $Expansion,
  $newline,
  $close
]) {
  return new Expansion([], {
    index: +$int.value,
    name: $name.value,
    args: $Expansion
  })
}

function createSlot([$dollar, $exclamation, $nameOrInt]) {
  return new Slot({
    name: $nameOrInt.value
  })
}

function createAction([$dollar, $open, $pound, $name, $close]) {
  return new Action({
    name: $name.value
  })
}

function createActionWithArguments([
  $dollar,
  $open,
  $pound,
  $name,
  $Args,
  $close
]) {
  return new Action({
    name: $name.value,
    args: $Args.map(([$colon, TextArgument]) => TextArgument)
  })
}

function createPlaceholderEvaluation([
  $dollar,
  $open,
  $int,
  $firstColon,
  $operator,
  $secondColon,
  $TextArgument,
  $close
]) {
  return new Evaluation({
    index: +$int.value,
    operator: $operator.value,
    comparator: $TextArgument
  })
}

function createVariableEvaluation([
  $dollar,
  $open,
  $name,
  $firstColon,
  $operator,
  $secondColon,
  $TextArgument,
  $close
]) {
  return new Evaluation({
    name: $name.value,
    operator: $operator.value,
    comparator: $TextArgument
  })
}

function createCondition([$Evaluation, $Evaluations, $equals, $Expansion]) {
  return new Condition({
    evaluations: [
      $Evaluation,
      ...$Evaluations.map(([$operator, $evaluation]) => $evaluation)
    ],
    operators: $Evaluations.map(([$operator]) => $operator.value),
    consequent: $Expansion
  })
}

function createTransform([
  $slash,
  $pattern,
  $secondSlash,
  $replacement,
  $Replacements,
  $thirdSlash,
  $flags
]) {
  let children = []

  if ($replacement) children.push(new Text($replacement.value))
  $Replacements.forEach(([$FormatString, $text]) => {
    children.push($FormatString)

    if ($text) children.push(new Text($text.value))
  })

  return new Transform(children, {
    pattern: new RegExp(
      $pattern.value.replace(/\$|}|\\/g, '\\$&'),
      $flags ? $flags.value : ''
    )
  })
}

function createFormatStringSimple([$dollar, $int]) {
  return new FormatString({
    index: +$int.value
  })
}

function createFormatStringBlock([$dollar, $open, $int, $close]) {
  return new FormatString({
    index: +$int.value,
    block: true
  })
}

function createFormatStringCaseModifier([
  $dollar,
  $open,
  $int,
  $colon,
  $caseModifier,
  $close
]) {
  return new FormatString({
    index: +$int.value,
    block: true,
    shorthandName: $caseModifier.value.replace('/', '')
  })
}

function createFormatStringIfCondition([
  $dollar,
  $open,
  $int,
  $colon,
  $plus,
  $condition,
  $close
]) {
  return new FormatString({
    index: +$int.value,
    block: true,
    ifValue: $condition.value
  })
}

function createFormatStringIfElseCondition([
  $dollar,
  $open,
  $int,
  $firstColon,
  $questionmark,
  $ifCondition,
  $secondColon,
  $elseCondition,
  $close
]) {
  return new FormatString({
    index: +$int.value,
    block: true,
    ifValue: $ifCondition.value,
    elseValue: $elseCondition.value
  })
}

function createFormatStringElseCondition([
  $dollar,
  $open,
  $int,
  $colon,
  $minus,
  $condition,
  $close
]) {
  return new FormatString({
    index: +$int.value,
    block: true,
    elseValue: $condition.value
  })
}

function createExpansionArgument([$newline, $slash, $name, $colon, $Snippet]) {
  return new ExpansionArgument({
    name: $name.value,
    arg: $Snippet
  })
}
%}
