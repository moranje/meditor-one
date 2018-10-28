// Generated automatically by nearley, version 2.15.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var replacement: any;
declare var slash: any;
declare var pattern: any;
declare var flags: any;
declare var dollar: any;
declare var int: any;
declare var open: any;
declare var close: any;
declare var colon: any;
declare var caseModifier: any;
declare var plus: any;
declare var condition: any;
declare var questionmark: any;
declare var minus: any;
declare var equals: any;
declare var pipe: any;
declare var comma: any;
declare var name: any;
declare var exclamation: any;
declare var pound: any;
declare var text: any;
declare var lineComment: any;
declare var inlineComment: any;
declare var newline: any;
declare var escape: any;

import lexer from './lexer';

import {
  snippet,
  tabstop,
  placeholder,
  choice,
  variable,
  transform,
  expansion,
  expansionSlot,
  snippetFunction,
  comment,
  textPartial,
  escaped
} from './grammar-helper';

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
    {"name": "Snippet$ebnf$1", "symbols": []},
    {"name": "Snippet$ebnf$1$subexpression$1", "symbols": ["Element", "Text"]},
    {"name": "Snippet$ebnf$1", "symbols": ["Snippet$ebnf$1", "Snippet$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "Snippet", "symbols": ["Text", "Snippet$ebnf$1"], "postprocess": snippet},
    {"name": "SingleLineSnippet$ebnf$1", "symbols": []},
    {"name": "SingleLineSnippet$ebnf$1$subexpression$1", "symbols": ["Element", "SingleLineText"]},
    {"name": "SingleLineSnippet$ebnf$1", "symbols": ["SingleLineSnippet$ebnf$1", "SingleLineSnippet$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "SingleLineSnippet", "symbols": ["SingleLineText", "SingleLineSnippet$ebnf$1"], "postprocess": snippet},
    {"name": "Element", "symbols": ["Tabstop"], "postprocess": id},
    {"name": "Element", "symbols": ["Placeholder"], "postprocess": id},
    {"name": "Element", "symbols": ["Choice"], "postprocess": id},
    {"name": "Element", "symbols": ["ExpansionSlot"], "postprocess": id},
    {"name": "Element", "symbols": ["Expansion"], "postprocess": id},
    {"name": "Element", "symbols": ["Variable"], "postprocess": id},
    {"name": "Element", "symbols": ["Function"], "postprocess": id},
    {"name": "Element", "symbols": ["Comment"], "postprocess": id},
    {"name": "TextOrExpansion", "symbols": ["SingleLineExpansion"], "postprocess": id},
    {"name": "TextOrExpansion", "symbols": ["Text"], "postprocess": id},
    {"name": "FormatOrReplacement", "symbols": ["Format"], "postprocess": id},
    {"name": "FormatOrReplacement", "symbols": [(lexer.has("replacement") ? {type: "replacement"} : replacement)]},
    {"name": "Transform$ebnf$1$subexpression$1", "symbols": ["FormatOrReplacement"]},
    {"name": "Transform$ebnf$1", "symbols": ["Transform$ebnf$1$subexpression$1"]},
    {"name": "Transform$ebnf$1$subexpression$2", "symbols": ["FormatOrReplacement"]},
    {"name": "Transform$ebnf$1", "symbols": ["Transform$ebnf$1", "Transform$ebnf$1$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "Transform$ebnf$2", "symbols": [(lexer.has("flags") ? {type: "flags"} : flags)], "postprocess": id},
    {"name": "Transform$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "Transform", "symbols": [(lexer.has("slash") ? {type: "slash"} : slash), (lexer.has("pattern") ? {type: "pattern"} : pattern), (lexer.has("slash") ? {type: "slash"} : slash), "Transform$ebnf$1", (lexer.has("slash") ? {type: "slash"} : slash), "Transform$ebnf$2"], "postprocess": transform},
    {"name": "Format", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("int") ? {type: "int"} : int)]},
    {"name": "Format", "symbols": [(lexer.has("open") ? {type: "open"} : open), (lexer.has("int") ? {type: "int"} : int), (lexer.has("close") ? {type: "close"} : close)]},
    {"name": "Format", "symbols": [(lexer.has("open") ? {type: "open"} : open), (lexer.has("int") ? {type: "int"} : int), (lexer.has("colon") ? {type: "colon"} : colon), (lexer.has("caseModifier") ? {type: "caseModifier"} : caseModifier), (lexer.has("close") ? {type: "close"} : close)]},
    {"name": "Format", "symbols": [(lexer.has("open") ? {type: "open"} : open), (lexer.has("int") ? {type: "int"} : int), (lexer.has("colon") ? {type: "colon"} : colon), (lexer.has("plus") ? {type: "plus"} : plus), (lexer.has("condition") ? {type: "condition"} : condition), (lexer.has("close") ? {type: "close"} : close)]},
    {"name": "Format", "symbols": [(lexer.has("open") ? {type: "open"} : open), (lexer.has("int") ? {type: "int"} : int), (lexer.has("colon") ? {type: "colon"} : colon), (lexer.has("questionmark") ? {type: "questionmark"} : questionmark), (lexer.has("condition") ? {type: "condition"} : condition), (lexer.has("colon") ? {type: "colon"} : colon), (lexer.has("condition") ? {type: "condition"} : condition), (lexer.has("close") ? {type: "close"} : close)]},
    {"name": "Format$ebnf$1", "symbols": [(lexer.has("minus") ? {type: "minus"} : minus)], "postprocess": id},
    {"name": "Format$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "Format", "symbols": [(lexer.has("open") ? {type: "open"} : open), (lexer.has("int") ? {type: "int"} : int), (lexer.has("colon") ? {type: "colon"} : colon), "Format$ebnf$1", (lexer.has("condition") ? {type: "condition"} : condition), (lexer.has("close") ? {type: "close"} : close)]},
    {"name": "Tabstop", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("int") ? {type: "int"} : int)], "postprocess": tabstop.simple},
    {"name": "Tabstop", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("equals") ? {type: "equals"} : equals), (lexer.has("int") ? {type: "int"} : int)], "postprocess": tabstop.anchor},
    {"name": "Tabstop", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("plus") ? {type: "plus"} : plus)], "postprocess": tabstop.incrementor},
    {"name": "Tabstop", "symbols": [(lexer.has("open") ? {type: "open"} : open), (lexer.has("int") ? {type: "int"} : int), (lexer.has("close") ? {type: "close"} : close)], "postprocess": tabstop.block},
    {"name": "Tabstop", "symbols": [(lexer.has("open") ? {type: "open"} : open), (lexer.has("equals") ? {type: "equals"} : equals), (lexer.has("int") ? {type: "int"} : int), (lexer.has("close") ? {type: "close"} : close)], "postprocess": tabstop.blockAnchor},
    {"name": "Tabstop", "symbols": [(lexer.has("open") ? {type: "open"} : open), (lexer.has("plus") ? {type: "plus"} : plus), (lexer.has("close") ? {type: "close"} : close)], "postprocess": tabstop.blockIncrementor},
    {"name": "Tabstop", "symbols": [(lexer.has("open") ? {type: "open"} : open), (lexer.has("int") ? {type: "int"} : int), "Transform", (lexer.has("close") ? {type: "close"} : close)], "postprocess": tabstop.transform},
    {"name": "Tabstop", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("plus") ? {type: "plus"} : plus), (lexer.has("int") ? {type: "int"} : int)], "postprocess": tabstop.rules.noIncrementorInteger},
    {"name": "Placeholder", "symbols": [(lexer.has("open") ? {type: "open"} : open), (lexer.has("int") ? {type: "int"} : int), (lexer.has("colon") ? {type: "colon"} : colon), "Snippet", (lexer.has("close") ? {type: "close"} : close)], "postprocess": placeholder.simple},
    {"name": "Placeholder", "symbols": [(lexer.has("open") ? {type: "open"} : open), (lexer.has("equals") ? {type: "equals"} : equals), (lexer.has("int") ? {type: "int"} : int), (lexer.has("colon") ? {type: "colon"} : colon), "Snippet", (lexer.has("close") ? {type: "close"} : close)], "postprocess": placeholder.anchor},
    {"name": "Placeholder", "symbols": [(lexer.has("open") ? {type: "open"} : open), (lexer.has("plus") ? {type: "plus"} : plus), (lexer.has("colon") ? {type: "colon"} : colon), "Snippet", (lexer.has("close") ? {type: "close"} : close)], "postprocess": placeholder.incrementor},
    {"name": "Placeholder", "symbols": [(lexer.has("open") ? {type: "open"} : open), (lexer.has("plus") ? {type: "plus"} : plus), (lexer.has("int") ? {type: "int"} : int), (lexer.has("colon") ? {type: "colon"} : colon), "Snippet", (lexer.has("close") ? {type: "close"} : close)], "postprocess": placeholder.rules.noIncrementorInteger},
    {"name": "Choice$ebnf$1", "symbols": []},
    {"name": "Choice$ebnf$1$subexpression$1", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), "TextOrExpansion"]},
    {"name": "Choice$ebnf$1", "symbols": ["Choice$ebnf$1", "Choice$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "Choice", "symbols": [(lexer.has("open") ? {type: "open"} : open), (lexer.has("int") ? {type: "int"} : int), (lexer.has("pipe") ? {type: "pipe"} : pipe), "TextOrExpansion", "Choice$ebnf$1", (lexer.has("pipe") ? {type: "pipe"} : pipe), (lexer.has("close") ? {type: "close"} : close)], "postprocess": choice.simple},
    {"name": "Choice$ebnf$2", "symbols": []},
    {"name": "Choice$ebnf$2$subexpression$1", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), "TextOrExpansion"]},
    {"name": "Choice$ebnf$2", "symbols": ["Choice$ebnf$2", "Choice$ebnf$2$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "Choice", "symbols": [(lexer.has("open") ? {type: "open"} : open), (lexer.has("equals") ? {type: "equals"} : equals), (lexer.has("int") ? {type: "int"} : int), (lexer.has("pipe") ? {type: "pipe"} : pipe), "TextOrExpansion", "Choice$ebnf$2", (lexer.has("pipe") ? {type: "pipe"} : pipe), (lexer.has("close") ? {type: "close"} : close)], "postprocess": choice.anchor},
    {"name": "Choice$ebnf$3", "symbols": []},
    {"name": "Choice$ebnf$3$subexpression$1", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), "TextOrExpansion"]},
    {"name": "Choice$ebnf$3", "symbols": ["Choice$ebnf$3", "Choice$ebnf$3$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "Choice", "symbols": [(lexer.has("open") ? {type: "open"} : open), (lexer.has("plus") ? {type: "plus"} : plus), (lexer.has("pipe") ? {type: "pipe"} : pipe), "TextOrExpansion", "Choice$ebnf$3", (lexer.has("pipe") ? {type: "pipe"} : pipe), (lexer.has("close") ? {type: "close"} : close)], "postprocess": choice.incrementor},
    {"name": "Choice$ebnf$4", "symbols": []},
    {"name": "Choice$ebnf$4$subexpression$1", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), "TextOrExpansion"]},
    {"name": "Choice$ebnf$4", "symbols": ["Choice$ebnf$4", "Choice$ebnf$4$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "Choice", "symbols": [(lexer.has("open") ? {type: "open"} : open), (lexer.has("plus") ? {type: "plus"} : plus), (lexer.has("int") ? {type: "int"} : int), (lexer.has("pipe") ? {type: "pipe"} : pipe), "TextOrExpansion", "Choice$ebnf$4", (lexer.has("pipe") ? {type: "pipe"} : pipe), (lexer.has("close") ? {type: "close"} : close)], "postprocess": choice.rules.noIncrementorInteger},
    {"name": "Variable", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), (lexer.has("name") ? {type: "name"} : name)], "postprocess": variable.simple},
    {"name": "Variable", "symbols": [(lexer.has("open") ? {type: "open"} : open), (lexer.has("name") ? {type: "name"} : name), (lexer.has("close") ? {type: "close"} : close)], "postprocess": variable.block},
    {"name": "Variable", "symbols": [(lexer.has("open") ? {type: "open"} : open), (lexer.has("name") ? {type: "name"} : name), (lexer.has("colon") ? {type: "colon"} : colon), "Snippet", (lexer.has("close") ? {type: "close"} : close)], "postprocess": variable.placeholder},
    {"name": "Variable", "symbols": [(lexer.has("open") ? {type: "open"} : open), (lexer.has("name") ? {type: "name"} : name), "Transform", (lexer.has("close") ? {type: "close"} : close)], "postprocess": variable.transform},
    {"name": "Expansion$ebnf$1", "symbols": []},
    {"name": "Expansion$ebnf$1$subexpression$1", "symbols": [(lexer.has("colon") ? {type: "colon"} : colon), "Snippet"]},
    {"name": "Expansion$ebnf$1", "symbols": ["Expansion$ebnf$1", "Expansion$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "Expansion", "symbols": [(lexer.has("open") ? {type: "open"} : open), (lexer.has("exclamation") ? {type: "exclamation"} : exclamation), (lexer.has("name") ? {type: "name"} : name), "Expansion$ebnf$1", (lexer.has("close") ? {type: "close"} : close)], "postprocess": expansion},
    {"name": "SingleLineExpansion$ebnf$1", "symbols": []},
    {"name": "SingleLineExpansion$ebnf$1$subexpression$1", "symbols": [(lexer.has("colon") ? {type: "colon"} : colon), "SingleLineSnippet"]},
    {"name": "SingleLineExpansion$ebnf$1", "symbols": ["SingleLineExpansion$ebnf$1", "SingleLineExpansion$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "SingleLineExpansion", "symbols": [(lexer.has("open") ? {type: "open"} : open), (lexer.has("exclamation") ? {type: "exclamation"} : exclamation), (lexer.has("name") ? {type: "name"} : name), "SingleLineExpansion$ebnf$1", (lexer.has("close") ? {type: "close"} : close)], "postprocess": expansion},
    {"name": "ExpansionSlot", "symbols": [(lexer.has("open") ? {type: "open"} : open), (lexer.has("exclamation") ? {type: "exclamation"} : exclamation), (lexer.has("int") ? {type: "int"} : int), (lexer.has("close") ? {type: "close"} : close)], "postprocess": expansionSlot},
    {"name": "Function$ebnf$1", "symbols": []},
    {"name": "Function$ebnf$1$subexpression$1", "symbols": [(lexer.has("colon") ? {type: "colon"} : colon), (lexer.has("text") ? {type: "text"} : text)]},
    {"name": "Function$ebnf$1", "symbols": ["Function$ebnf$1", "Function$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "Function", "symbols": [(lexer.has("open") ? {type: "open"} : open), (lexer.has("pound") ? {type: "pound"} : pound), (lexer.has("name") ? {type: "name"} : name), "Function$ebnf$1", (lexer.has("close") ? {type: "close"} : close)], "postprocess": snippetFunction},
    {"name": "Comment", "symbols": [(lexer.has("lineComment") ? {type: "lineComment"} : lineComment)], "postprocess": comment},
    {"name": "Comment", "symbols": [(lexer.has("inlineComment") ? {type: "inlineComment"} : inlineComment)], "postprocess": comment},
    {"name": "Text$ebnf$1", "symbols": []},
    {"name": "Text$ebnf$1", "symbols": ["Text$ebnf$1", "TextPartial"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "Text", "symbols": ["Text$ebnf$1"], "postprocess": textPartial},
    {"name": "SingleLineText$ebnf$1", "symbols": []},
    {"name": "SingleLineText$ebnf$1", "symbols": ["SingleLineText$ebnf$1", "SingleLineTextPartial"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "SingleLineText", "symbols": ["SingleLineText$ebnf$1"], "postprocess": textPartial},
    {"name": "TextPartial", "symbols": [(lexer.has("text") ? {type: "text"} : text)], "postprocess": id},
    {"name": "TextPartial", "symbols": [(lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": id},
    {"name": "TextPartial", "symbols": [(lexer.has("escape") ? {type: "escape"} : escape)], "postprocess": escaped},
    {"name": "SingleLineTextPartial", "symbols": [(lexer.has("text") ? {type: "text"} : text)], "postprocess": id},
    {"name": "SingleLineTextPartial", "symbols": [(lexer.has("escape") ? {type: "escape"} : escape)], "postprocess": escaped}
];

export var ParserStart: string = "Snippet";
