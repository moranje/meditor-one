@preprocessor typescript

@{%
import lexer from './lexer';

import {
  Snippet,
  Tabstop,
  Choice,
  Variable,
  Transform,
  Expansion,
  Slot,
  Action,
  Comment,
  Text
} from './classes';
%}

# Use moo tokenizer
@lexer lexer

# TODO: add rules for faulty patterns

Snippet ->
  Text (Element Text):* {% snippet %}

Element ->
  Placeholder {% id %}
  | Choice {% id %}
  | Variable {% id %}
  | Expansion {% id %}
  | Slot {% id %}
  | Action {% id %}
  | Expression {% id %}
  | Result {% id %}
  | Comment {% id %}
  # Should there be a catch all clause here to keep the parser from tripping?

Text ->
  TextPartial:* {% text %}

TextPartial ->
  %text {% id %}
  | %newline {% id %}
  | %operator {% id %}
  | %equals {% id %}
  | %escape {% escaped %}

Comment ->
  %comment {% comment %}

Placeholder ->
  %dollar %int {% placeholderSimple %}
  | %dollar %namedInt %openTag %intName %closeTag {% placeholderNamedSimple %}
  | %dollar %open %int %close {% placeholderBlock %}
  | %dollar %open %namedInt %openTag %intName %close {% placeholderNamedBlock %}
  | %dollar %open %int %colon Snippet %close {% placeholderBlockWithArg %}
  | %dollar %open %namedInt %openTag %intName %colon Snippet %close {% placeholderNamedBlockWithArg %}
  | %dollar %open %int Transform %close {% placeholderTransform %}

Choice ->
  %dollar %open %int %pipe ChoiceOption (%comma ChoiceOption):* %pipe %close {% choice %}

Variable ->
  %dollar %name {% variableSimple %}
  | %dollar %open %name %close {% variableBlock %}
  | %dollar %open %name %colon Snippet %close {% variableBlockWithArg %}
  | %dollar %open %name Transform %close {% variableTransform %}

# FIXME: this won't work, if any of the args is a snippet it's unparsable
# A possible solution would be to only allow expansion references
Expansion ->
  %open %exclamation %name (%newline %slash %int %colon Snippet):* %close {% expansion %}
  | %open %exclamation %name (%newline %slash %name %colon Snippet):* %close {% expansion %}

Slot ->
  %dollar %exclamation %int {% slot %}
  | %dollar %exclamation %name {% slot %}

Action ->
  %dollar %open %pound %name (%colon %text):* %close {% action %}

Expression ->
  %dollar %open %int %%operator %text %close {% placeholderExpression %}
  | %dollar %open %name %%operator %text %close {% variableExpression %}

Result ->
  Expression (%operator Expression):* %equals Expansion {% result %}
  # Mayhaps allow Placeholder, Choice and Variable Elements?

Transform ->
  %slash %pattern %slash (Format):+ %slash %flags:? {% transform %}

ChoiceOption ->
  Text {% choiceOption %}
  | %exclamation% Text {% choiceOptionExpansion %}

Format ->
  %dollar %int
  | %dollar %open %int %close
  | %dollar %open %int %colon %caseModifier %close
  | %dollar %open %int %colon %plus %condition %close
  | %dollar %open %int %colon %questionmark %condition %colon %condition %close
  | %dollar %open %int %colon %minus:? %condition %close


# *****************************************************************************
# FUNCTIONS
# *****************************************************************************

@{%
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
  $Snippet,
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
  $Snippet,
  $close
]) {}

function placeholderTransform([$dollar, $open, $int, $Transform, $close]) {}

function choice([
  $dollar,
  $open,
  $int,
  $pipeOpen,
  $ChoiceOption,
  $ChoiceOptions,
  $pipeClose,
  $close
]) {}

function variableSimple([$dollar, $name]) {}

function variableBlock([$dollar, $open, $name, $close]) {}

function variableBlockWithArg([$dollar, $open, $name, $colon, $Snippet, $close]) {}

function variableTransform([$dollar, $open, $name, $Transform, $close]) {}

function expansion([$dollar, $open, $exclamation, $text, separatedArgs, close]) {}

function slot() {}

function action() {}

function placeholderExpression() {}

function variableExpression() {}

function result() {}

function transform([
  $slash,
  $pattern,
  $secondSlash,
  $Format,
  $thirdSlash,
  $flags
]) {}

function choiceOption() {}

function choiceOptionExpansion() {}

%}
