import { isInteger } from 'lodash';
import Node from './node';
import {
  Text,
  Tabstop,
  Placeholder,
  Choice,
  Substitution,
  Expansion,
  TabstopList
} from './index';

function getType(text = '') {
  if (/^\$\d+$/.test(text)) {
    return 'field';
  } else if (/^\$\{\d+\}$/.test(text)) {
    return 'field';
  } else if (/^\$\{\d+:[^}]*?\}/.test(text)) {
    return 'placeholder';
  } else if (/^\$\{\d+\|[^}]*?\|\}/.test(text)) {
    return 'choice';
  } else if (/^\$\{[0-9]+\/[^}]*?\/[gmi]?\}$/.test(text)) {
    return 'substitution';
  } else if (/^\$\{[a-zA-Z_]+\/[^}]*?\/[gmi]?\}$/.test(text)) {
    return 'substitution variable';
  } else if (/^\$\{!\d+:.*?\}$/.test(text)) {
    return 'expansion';
  } else if (/^\$\{#if [0-9a-zA-Z_]+:[^:}]+\}$/.test(text)) {
    return 'if';
  } else if (/^\$\{#if [0-9a-zA-Z_]+:[^:}]+:[^:}]+\}$/.test(text)) {
    return 'if condition';
  } else if (/^\$\{#unless [0-9a-zA-Z_]+:[^:}]+\}$/.test(text)) {
    return 'unless';
  } else if (/^\$\{#unless [0-9a-zA-Z_]+:[^:}]+:[^:}]+\}$/.test(text)) {
    return 'unless condition';
  }

  return 'text';
}

function extractTabstop(text, type) {
  if (type === 'field') {
    return +text.replace(/\$\{?(\d+)\}?/, '$1');
  } else if (type === 'placeholder') {
    return +text.replace(/\$\{(\d+):[^}]*?\}/, '$1');
  } else if (type === 'choice') {
    return +text.replace(/\$\{(\d+)\|[^}]*?\}/, '$1');
  } else if (type === 'substitution') {
    return +text.replace(/\$\{(\d+)\/[^}]*?\}/, '$1');
  } else if (type === 'expansion') {
    return +text.replace(/\$\{!(\d+):.*?\}/, '$1');
  }

  return null;
}

function matchAll(string, regex) {
  const matches = string.match(regex);

  // Return only the matched group
  matches.shift();

  return matches;
}

function nameMatchedGroups(string, regex, names) {
  const matches = {};

  matchAll(string, regex).forEach((match, index) => {
    matches[names[index]] = match;
  });

  return matches;
}

export class SnippetFunction extends Text {
  type: string;
  transform: undefined | string;
  constructor(template, type = null) {
    super(template);

    this.type = type;
  }
}

export class IfFunction extends SnippetFunction {
  subtype: string;
  variable: string;
  replacement: string;
  constructor(text, type) {
    super(text, type);

    const functionMatch = /\$\{#if ([0-9a-zA-Z_]+):([^:}]+)\}/;

    Object.assign(
      this,
      nameMatchedGroups(text, functionMatch, ['variable', 'replacement'])
    );
  }

  get transform() {
    return `\${${this.variable}/(^.+$)/\${1:+${this.replacement}}/}`;
  }
}

export class IfConditionFunction extends SnippetFunction {
  subtype: string;
  variable: string;
  match: string;
  replacement: string;
  constructor(text, type) {
    super(text, type);

    const functionMatch = /\$\{#if ([0-9a-zA-Z_]+):([^:}]+):([^:}]+)\}/;

    Object.assign(
      this,
      nameMatchedGroups(text, functionMatch, [
        'variable',
        'match',
        'replacement'
      ])
    );
  }

  get transform() {
    return `\${${this.variable}/(${this.match})|(^.*?$)/\${1:+${
      this.replacement
    }}/}`;
  }
}

export class UnlessFunction extends SnippetFunction {
  subtype: string;
  variable: string;
  replacement: string;
  constructor(text, type) {
    super(text, type);

    const functionMatch = /\$\{#unless ([0-9a-zA-Z_]+):([^:}]+)\}/;

    Object.assign(
      this,
      nameMatchedGroups(text, functionMatch, ['variable', 'replacement'])
    );
  }

  get transform() {
    return `\${${this.variable}/(^.+$)|(^.*?$)/\${1:? :${this.replacement}}/}`;
  }
}

export class UnlessConditionFunction extends SnippetFunction {
  subtype: string;
  variable: string;
  match: string;
  replacement: string;
  constructor(text, type) {
    super(text, type);

    const functionMatch = /\$\{#unless ([0-9a-zA-Z_]+):([^:}]+):([^:}]+)\}/;

    Object.assign(
      this,
      nameMatchedGroups(text, functionMatch, [
        'variable',
        'match',
        'replacement'
      ])
    );
  }

  get transform() {
    return `\${${this.variable}/(${this.match})|(^.*?$)/\${1:? :${
      this.replacement
    }}/}`;
  }
}

export default function factory(
  text: string,
  tabstops?: TabstopList
):
  | Text
  | Tabstop
  | Placeholder
  | Substitution
  | Choice
  | Expansion
  | IfFunction
  | IfConditionFunction
  | UnlessFunction
  | UnlessConditionFunction {
  const type = getType(text);

  if (type === 'text') {
    return new Text(text);
  } else if (type === 'field') {
    return new Tabstop(text);
  } else if (type === 'placeholder') {
    return new Placeholder(text);
  } else if (type === 'substitution') {
    return new Substitution(text, tabstops);
  } else if (type === 'substitution variable') {
    return new Text(text);
  } else if (type === 'choice') {
    return new Choice(text);
  } else if (type === 'expansion') {
    return new Expansion(text);
  } else if (type === 'if') {
    return new IfFunction(text, type);
  } else if (type === 'if condition') {
    return new IfConditionFunction(text, type);
  } else if (type === 'unless') {
    return new UnlessFunction(text, type);
  } else if (type === 'unless condition') {
    return new UnlessConditionFunction(text, type);
  }

  throw new Error(
    `Snippet factory function doesn't return anything (text: ${text}, type: ${type})`
  );
}
