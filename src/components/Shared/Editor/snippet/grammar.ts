// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var text: any;
declare var newline: any;
declare var operator: any;
declare var equals: any;
declare var escape: any;
declare var comment: any;
declare var dollar: any;
declare var int: any;
declare var namedInt: any;
declare var openTag: any;
declare var name: any;
declare var closeTag: any;
declare var open: any;
declare var close: any;
declare var intName: any;
declare var colon: any;
declare var pipe: any;
declare var comma: any;
declare var exclamation: any;
declare var pound: any;
declare var slash: any;
declare var caseModifier: any;
declare var plus: any;
declare var condition: any;
declare var questionmark: any;
declare var minus: any;
declare var operatorColon: any;

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

export interface Token { value: any; [key: string]: any };

export interface Lexer {
  reset: (chunk: string, info: any) => void;
  next: () => Token | undefined;
  save: () => any;
  formatError: (token: Token) => string;
  has: (tokenType: string) => boolean
};

export interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any
};

export type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

export var Lexer: Lexer | undefined = lexer;

export var ParserRules: NearleyRule[] = [
    {"name": "Snippet$ebnf$1", "symbols": ["Text"], "postprocess": id},
    {"name": "Snippet$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "Snippet$ebnf$2", "symbols": []},
    {"name": "Snippet$ebnf$2$subexpression$1$ebnf$1", "symbols": ["Text"], "postprocess": id},
    {"name": "Snippet$ebnf$2$subexpression$1$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "Snippet$ebnf$2$subexpression$1", "symbols": ["Element", "Snippet$ebnf$2$subexpression$1$ebnf$1"]},
    {"name": "Snippet$ebnf$2", "symbols": ["Snippet$ebnf$2", "Snippet$ebnf$2$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "Snippet", "symbols": ["Snippet$ebnf$1", "Snippet$ebnf$2"], "postprocess": createSnippet},
    {"name": "Element", "symbols": ["Placeholder"], "postprocess": id},
    {"name": "Element", "symbols": ["Choice"], "postprocess": id},
    {"name": "Element", "symbols": ["Variable"], "postprocess": id},
    {"name": "Element", "symbols": ["Expansion"], "postprocess": id},
    {"name": "Element", "symbols": ["Slot"], "postprocess": id},
    {"name": "Element", "symbols": ["Action"], "postprocess": id},
    {"name": "Element", "symbols": ["Condition"], "postprocess": id},
    {"name": "Element", "symbols": ["Comment"], "postprocess": id},
    {"name": "Text$ebnf$1", "symbols": []},
    {"name": "Text$ebnf$1", "symbols": ["Text$ebnf$1", "TextPartial"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "Text", "symbols": ["Text$ebnf$1"], "postprocess": createText},
    {"name": "TextPartial", "symbols": [(lexer.has("text") ? {type: "text"} : text)], "postprocess": id},
    {"name": "TextPartial", "symbols": [(lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": id},
    {"name": "TextPartial", "symbols": [(lexer.has("operator") ? {type: "operator"} : operator)], "postprocess": id},
    {"name": "TextPartial", "symbols": [(lexer.has("equals") ? {type: "equals"} : equals)], "postprocess": id},
    {"name": "TextPartial", "symbols": [(lexer.has("escape") ? {type: "escape"} : escape)], "postprocess": createEscaped},
    {"name": "Comment", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment)], "postprocess": createComment},
    {"name": "Placeholder", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("int") ? {type: "int"} : int)], "postprocess": createPlaceholderSimple},
    {"name": "Placeholder", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("namedInt") ? {type: "namedInt"} : namedInt), (lexer.has("openTag") ? {type: "openTag"} : openTag), (lexer.has("name") ? {type: "name"} : name), (lexer.has("closeTag") ? {type: "closeTag"} : closeTag)], "postprocess": createPlaceholderNamedSimple},
    {"name": "Placeholder", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("open") ? {type: "open"} : open), (lexer.has("int") ? {type: "int"} : int), (lexer.has("close") ? {type: "close"} : close)], "postprocess": createPlaceholderBlock},
    {"name": "Placeholder", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("open") ? {type: "open"} : open), (lexer.has("int") ? {type: "int"} : int), (lexer.has("openTag") ? {type: "openTag"} : openTag), (lexer.has("intName") ? {type: "intName"} : intName), (lexer.has("closeTag") ? {type: "closeTag"} : closeTag), (lexer.has("close") ? {type: "close"} : close)], "postprocess": createPlaceholderNamedBlock},
    {"name": "Placeholder", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("open") ? {type: "open"} : open), (lexer.has("int") ? {type: "int"} : int), (lexer.has("colon") ? {type: "colon"} : colon), "Snippet", (lexer.has("close") ? {type: "close"} : close)], "postprocess": createPlaceholderBlockWithArgument},
    {"name": "Placeholder", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("open") ? {type: "open"} : open), (lexer.has("int") ? {type: "int"} : int), (lexer.has("openTag") ? {type: "openTag"} : openTag), (lexer.has("intName") ? {type: "intName"} : intName), (lexer.has("closeTag") ? {type: "closeTag"} : closeTag), (lexer.has("colon") ? {type: "colon"} : colon), "Snippet", (lexer.has("close") ? {type: "close"} : close)], "postprocess": createPlaceholderNamedBlockWithArgument},
    {"name": "Placeholder", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("open") ? {type: "open"} : open), (lexer.has("int") ? {type: "int"} : int), "Transform", (lexer.has("close") ? {type: "close"} : close)], "postprocess": createPlaceholderTransform},
    {"name": "Choice$ebnf$1", "symbols": ["ChoiceOption"], "postprocess": id},
    {"name": "Choice$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "Choice$ebnf$2", "symbols": []},
    {"name": "Choice$ebnf$2$subexpression$1", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), "ChoiceOption"]},
    {"name": "Choice$ebnf$2", "symbols": ["Choice$ebnf$2", "Choice$ebnf$2$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "Choice", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("open") ? {type: "open"} : open), (lexer.has("int") ? {type: "int"} : int), (lexer.has("pipe") ? {type: "pipe"} : pipe), "Choice$ebnf$1", "Choice$ebnf$2", (lexer.has("pipe") ? {type: "pipe"} : pipe), (lexer.has("close") ? {type: "close"} : close)], "postprocess": createChoice},
    {"name": "Variable", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("name") ? {type: "name"} : name)], "postprocess": createVariableSimple},
    {"name": "Variable", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("open") ? {type: "open"} : open), (lexer.has("name") ? {type: "name"} : name), (lexer.has("close") ? {type: "close"} : close)], "postprocess": createVariableBlock},
    {"name": "Variable", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("open") ? {type: "open"} : open), (lexer.has("name") ? {type: "name"} : name), (lexer.has("colon") ? {type: "colon"} : colon), "Snippet", (lexer.has("close") ? {type: "close"} : close)], "postprocess": createVariableBlockWithArgument},
    {"name": "Variable", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("open") ? {type: "open"} : open), (lexer.has("name") ? {type: "name"} : name), "Transform", (lexer.has("close") ? {type: "close"} : close)], "postprocess": createVariableTransform},
    {"name": "Expansion", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("open") ? {type: "open"} : open), (lexer.has("exclamation") ? {type: "exclamation"} : exclamation), (lexer.has("int") ? {type: "int"} : int), (lexer.has("colon") ? {type: "colon"} : colon), (lexer.has("name") ? {type: "name"} : name), (lexer.has("close") ? {type: "close"} : close)], "postprocess": createExpansion},
    {"name": "Expansion$ebnf$1$subexpression$1", "symbols": ["ExpansionArgument"], "postprocess": id},
    {"name": "Expansion$ebnf$1", "symbols": ["Expansion$ebnf$1$subexpression$1"]},
    {"name": "Expansion$ebnf$1$subexpression$2", "symbols": ["ExpansionArgument"], "postprocess": id},
    {"name": "Expansion$ebnf$1", "symbols": ["Expansion$ebnf$1", "Expansion$ebnf$1$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "Expansion$ebnf$2", "symbols": [(lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": id},
    {"name": "Expansion$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "Expansion", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("open") ? {type: "open"} : open), (lexer.has("exclamation") ? {type: "exclamation"} : exclamation), (lexer.has("int") ? {type: "int"} : int), (lexer.has("colon") ? {type: "colon"} : colon), (lexer.has("name") ? {type: "name"} : name), "Expansion$ebnf$1", "Expansion$ebnf$2", (lexer.has("close") ? {type: "close"} : close)], "postprocess": createExpansionWithArgument},
    {"name": "Slot$subexpression$1", "symbols": [(lexer.has("name") ? {type: "name"} : name)], "postprocess": id},
    {"name": "Slot$subexpression$1", "symbols": [(lexer.has("int") ? {type: "int"} : int)], "postprocess": id},
    {"name": "Slot", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("exclamation") ? {type: "exclamation"} : exclamation), "Slot$subexpression$1"], "postprocess": createSlot},
    {"name": "Action", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("open") ? {type: "open"} : open), (lexer.has("pound") ? {type: "pound"} : pound), (lexer.has("name") ? {type: "name"} : name), (lexer.has("close") ? {type: "close"} : close)], "postprocess": createAction},
    {"name": "Action$ebnf$1$subexpression$1", "symbols": [(lexer.has("colon") ? {type: "colon"} : colon), "TextArgument"]},
    {"name": "Action$ebnf$1", "symbols": ["Action$ebnf$1$subexpression$1"]},
    {"name": "Action$ebnf$1$subexpression$2", "symbols": [(lexer.has("colon") ? {type: "colon"} : colon), "TextArgument"]},
    {"name": "Action$ebnf$1", "symbols": ["Action$ebnf$1", "Action$ebnf$1$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "Action", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("open") ? {type: "open"} : open), (lexer.has("pound") ? {type: "pound"} : pound), (lexer.has("name") ? {type: "name"} : name), "Action$ebnf$1", (lexer.has("close") ? {type: "close"} : close)], "postprocess": createActionWithArguments},
    {"name": "Condition$ebnf$1", "symbols": []},
    {"name": "Condition$ebnf$1$subexpression$1", "symbols": [(lexer.has("operator") ? {type: "operator"} : operator), "Evaluation"]},
    {"name": "Condition$ebnf$1", "symbols": ["Condition$ebnf$1", "Condition$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "Condition", "symbols": ["Evaluation", "Condition$ebnf$1", (lexer.has("equals") ? {type: "equals"} : equals), "Expansion"], "postprocess": createCondition},
    {"name": "Transform$ebnf$1", "symbols": [(lexer.has("text") ? {type: "text"} : text)], "postprocess": id},
    {"name": "Transform$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "Transform$ebnf$2", "symbols": []},
    {"name": "Transform$ebnf$2$subexpression$1$ebnf$1", "symbols": [(lexer.has("text") ? {type: "text"} : text)], "postprocess": id},
    {"name": "Transform$ebnf$2$subexpression$1$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "Transform$ebnf$2$subexpression$1", "symbols": ["FormatString", "Transform$ebnf$2$subexpression$1$ebnf$1"]},
    {"name": "Transform$ebnf$2", "symbols": ["Transform$ebnf$2", "Transform$ebnf$2$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "Transform$ebnf$3", "symbols": [(lexer.has("text") ? {type: "text"} : text)], "postprocess": id},
    {"name": "Transform$ebnf$3", "symbols": [], "postprocess": () => null},
    {"name": "Transform", "symbols": [(lexer.has("slash") ? {type: "slash"} : slash), (lexer.has("text") ? {type: "text"} : text), (lexer.has("slash") ? {type: "slash"} : slash), "Transform$ebnf$1", "Transform$ebnf$2", (lexer.has("slash") ? {type: "slash"} : slash), "Transform$ebnf$3"], "postprocess": createTransform},
    {"name": "FormatString", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("int") ? {type: "int"} : int)], "postprocess": createFormatStringSimple},
    {"name": "FormatString", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("open") ? {type: "open"} : open), (lexer.has("int") ? {type: "int"} : int), (lexer.has("close") ? {type: "close"} : close)], "postprocess": createFormatStringBlock},
    {"name": "FormatString", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("open") ? {type: "open"} : open), (lexer.has("int") ? {type: "int"} : int), (lexer.has("colon") ? {type: "colon"} : colon), (lexer.has("caseModifier") ? {type: "caseModifier"} : caseModifier), (lexer.has("close") ? {type: "close"} : close)], "postprocess": createFormatStringCaseModifier},
    {"name": "FormatString", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("open") ? {type: "open"} : open), (lexer.has("int") ? {type: "int"} : int), (lexer.has("colon") ? {type: "colon"} : colon), (lexer.has("plus") ? {type: "plus"} : plus), (lexer.has("condition") ? {type: "condition"} : condition), (lexer.has("close") ? {type: "close"} : close)], "postprocess": createFormatStringIfCondition},
    {"name": "FormatString", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("open") ? {type: "open"} : open), (lexer.has("int") ? {type: "int"} : int), (lexer.has("colon") ? {type: "colon"} : colon), (lexer.has("questionmark") ? {type: "questionmark"} : questionmark), (lexer.has("condition") ? {type: "condition"} : condition), (lexer.has("colon") ? {type: "colon"} : colon), (lexer.has("condition") ? {type: "condition"} : condition), (lexer.has("close") ? {type: "close"} : close)], "postprocess": createFormatStringIfElseCondition},
    {"name": "FormatString$ebnf$1", "symbols": [(lexer.has("minus") ? {type: "minus"} : minus)], "postprocess": id},
    {"name": "FormatString$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "FormatString", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("open") ? {type: "open"} : open), (lexer.has("int") ? {type: "int"} : int), (lexer.has("colon") ? {type: "colon"} : colon), "FormatString$ebnf$1", (lexer.has("condition") ? {type: "condition"} : condition), (lexer.has("close") ? {type: "close"} : close)], "postprocess": createFormatStringElseCondition},
    {"name": "ChoiceOption", "symbols": ["Expansion"], "postprocess": id},
    {"name": "ChoiceOption", "symbols": ["TextArgument"], "postprocess": id},
    {"name": "Evaluation", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("open") ? {type: "open"} : open), (lexer.has("int") ? {type: "int"} : int), (lexer.has("operatorColon") ? {type: "operatorColon"} : operatorColon), (lexer.has("operator") ? {type: "operator"} : operator), (lexer.has("colon") ? {type: "colon"} : colon), "TextArgument", (lexer.has("close") ? {type: "close"} : close)], "postprocess": createPlaceholderEvaluation},
    {"name": "Evaluation", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("open") ? {type: "open"} : open), (lexer.has("name") ? {type: "name"} : name), (lexer.has("operatorColon") ? {type: "operatorColon"} : operatorColon), (lexer.has("operator") ? {type: "operator"} : operator), (lexer.has("colon") ? {type: "colon"} : colon), "TextArgument", (lexer.has("close") ? {type: "close"} : close)], "postprocess": createVariableEvaluation},
    {"name": "TextArgument$ebnf$1", "symbols": []},
    {"name": "TextArgument$ebnf$1", "symbols": ["TextArgument$ebnf$1", "TextArgumentPartial"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "TextArgument", "symbols": ["TextArgument$ebnf$1"], "postprocess": createText},
    {"name": "TextArgumentPartial", "symbols": [(lexer.has("text") ? {type: "text"} : text)], "postprocess": id},
    {"name": "TextArgumentPartial", "symbols": [(lexer.has("escape") ? {type: "escape"} : escape)], "postprocess": createEscaped},
    {"name": "ExpansionArgument$subexpression$1", "symbols": [(lexer.has("name") ? {type: "name"} : name)], "postprocess": id},
    {"name": "ExpansionArgument$subexpression$1", "symbols": [(lexer.has("int") ? {type: "int"} : int)], "postprocess": id},
    {"name": "ExpansionArgument", "symbols": [(lexer.has("newline") ? {type: "newline"} : newline), (lexer.has("slash") ? {type: "slash"} : slash), "ExpansionArgument$subexpression$1", (lexer.has("colon") ? {type: "colon"} : colon), "Snippet"], "postprocess": createExpansionArgument}
];

export var ParserStart: string = "Snippet";
