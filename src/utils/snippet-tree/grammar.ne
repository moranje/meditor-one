@preprocessor typescript

@{%
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
%}

# Use moo tokenizer
@lexer lexer

# TODO: add rules for faulty patterns

Snippet ->
  Text (Element Text):* {% snippet %}

Element ->
  Tabstop {% id %}
  | Placeholder {% id %}
  | Choice {% id %}
  | ExpansionSlot {% id %}
  | Expansion {% id %}
  | Variable {% id %}
  | Function {% id %}
  | Comment {% id %}

TextOrExpansion ->
  Expansion {% id %}
  | Text {% id %}

FormatOrReplacement ->
  Format {% id %}
  | %replacement

Transform ->
  %slash %pattern %slash (FormatOrReplacement):+ %slash %flags:? {% transform %}

Format ->
  %dollar %int
  | %open %int %close
  | %open %int %colon %caseModifier %close
  | %open %int %colon %plus %condition %close
  | %open %int %colon %questionmark %condition %colon %condition %close
  | %open %int %colon %minus:? %condition %close

Tabstop ->
  %dollar %int {% tabstop.simple %}
  | %dollar %equals %int {% tabstop.anchor %}
  | %dollar %plus {% tabstop.incrementor %}
  | %open %int %close {% tabstop.block %}
  | %open %equals %int %close {% tabstop.blockAnchor %}
  | %open %plus %close {% tabstop.blockIncrementor %}
  | %open %int Transform %close {% tabstop.transform %}
  # Rules
  | %dollar %plus %int {% tabstop.rules.noIncrementorInteger %}

# Placeholder ::= "${" ( Modifier:? Integer:? ":" Snippet ) "}"
Placeholder ->
  %open %int %colon Snippet %close {% placeholder.simple %}
  | %open %equals %int %colon Snippet %close {% placeholder.anchor %}
  | %open %plus %colon Snippet %close {% placeholder.incrementor %}
  # Rules
  | %open %plus %int %colon Snippet %close {% placeholder.rules.noIncrementorInteger %}

Choice ->
  %open %int %pipe TextOrExpansion (%comma TextOrExpansion):* %pipe %close {% choice.simple %}
  | %open %equals %int %pipe TextOrExpansion (%comma TextOrExpansion):* %pipe %close {% choice.anchor %}
  | %open %plus %pipe TextOrExpansion (%comma TextOrExpansion):* %pipe %close {% choice.incrementor %}
  # Rules
  | %open %plus %int %pipe TextOrExpansion (%comma TextOrExpansion):* %pipe %close {% choice.rules.noIncrementorInteger %}

Variable ->
  %dollar %name {% variable.simple %}
  | %open %name %close {% variable.block %}
  | %open %name %colon Snippet %close {% variable.placeholder %}
  | %open %name Transform %close {% variable.transform %}

Expansion ->
  %open %exclamation %name (%colon Snippet):* %close {% expansion %}

ExpansionSlot ->
  %open %exclamation %int %close {% expansionSlot %}

Function ->
   %open %pound %name (%colon %text):* %close {% snippetFunction %}

# Comment ::= "#" .:*
Comment ->
  %lineComment {% comment %}
  | %inlineComment {% comment %}

# Text ::= .:+
Text ->
  TextPartial:* {% textPartial %}

TextPartial ->
  %text {% id %}
  | %escape {% escaped %}
