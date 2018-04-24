import { forEach } from 'lodash';
import LinkedList from '../linked-list';
import {
  Tabstop,
  Expansion,
  Placeholder,
  Choice,
  Substitution,
  Text,
  SnippetFunction,
  If,
  IfCondition,
  Unless,
  UnlessCondition,
  Anchor,
  Incrementor
} from '.';
import TabstopList from './tabstop-list';

function initSnippet(text: string, parent: SnippetList) {
  if (/^\$\d+$/.test(text)) {
    return new Tabstop(text, parent);
  } else if (/^\$\{\d+\}$/.test(text)) {
    return new Tabstop(text, parent);
  } else if (/^\$\{\d+:[^}]*?\}/.test(text)) {
    return new Placeholder(text, parent);
  } else if (/^\$\{\d+\|[^}]*?\|\}/.test(text)) {
    return new Choice(text, parent);
  } else if (/^\$\{[0-9a-zA-Z_]+\/[^}]*?\/[gmi]?\}$/.test(text)) {
    return new Substitution(text, parent);
  } else if (/^(\$=\d+)|(\$\{=.*?\})$/.test(text)) {
    return new Anchor(text, parent);
  } else if (/^(\$\+\d+)|(\$\{\+.*?\})$/.test(text)) {
    return new Incrementor(text, parent);
  } else if (/^\$\{!.*?\}$/.test(text)) {
    return new Expansion(text, parent);
  } else if (/^\$\{#if [0-9a-zA-Z_]+:[^:}]+\}$/.test(text)) {
    return new If(text, parent);
  } else if (/^\$\{#if [0-9a-zA-Z_]+:[^:}]+:[^:}]+\}$/.test(text)) {
    return new IfCondition(text, parent);
  } else if (/^\$\{#unless [0-9a-zA-Z_]+:[^:}]+\}$/.test(text)) {
    return new Unless(text, parent);
  } else if (/^\$\{#unless [0-9a-zA-Z_]+:[^:}]+:[^:}]+\}$/.test(text)) {
    return new UnlessCondition(text, parent);
  }

  return new Text(text, parent);
}

export default class SnippetList extends LinkedList {
  private _text: string;
  private _references: any;
  private _tabstops: TabstopList;
  // private _expanded: number;
  constructor(text: string, references?: any) {
    super();

    this._text = text;
    this._references = references;
    this._tabstops = new TabstopList();

    this.parse();
  }

  get text() {
    return this._text;
  }

  get tabstops() {
    return this._tabstops;
  }

  get references() {
    return this._references;
  }

  private _matchDigit(text, start) {
    let index = -1;

    for (let $index = start; $index < text.length; $index++) {
      if (start === $index && /=|\+/.test(text[$index])) {
        // Modifier, continue
      } else if (/\d/.test(text[$index])) {
        index = $index;
      } else {
        return index;
      }
    }

    return index;
  }

  private _matchBracket(text, start) {
    let bracketCount = 0; // No brackets matched yet

    for (let index = start; index < text.length; index++) {
      if (text[index] === '{') {
        bracketCount += 1;
      }

      if (text[index] === '}') {
        bracketCount -= 1;

        if (bracketCount === 0) return index;
      }
    }

    return null;
  }

  private _parse(text, fn) {
    const regex = /\$/g;
    let match = regex.exec(text);
    let pointer = 0;
    let found = {
      index: -1,
      text: ''
    };

    while (match !== null) {
      if (pointer <= match.index) {
        found.index = match.index;

        let tabstop = this._matchDigit(text, match.index + 1);
        let brackets = this._matchBracket(text, match.index + 1);

        if (tabstop !== -1) {
          found.text = text.substring(match.index, tabstop + 1);

          fn(found);

          pointer = match.index + found.text.length;
        } else if (brackets) {
          found.text = text.substring(match.index, brackets + 1);

          fn(found);

          pointer = match.index + found.text.length;
        }
      }

      match = regex.exec(text);
    }
  }

  parse() {
    let characterIndex = 0;
    let hasMatch = false;

    this._parse(this.text, match => {
      if (match.index > characterIndex) {
        this.push(
          initSnippet(this.text.substring(characterIndex, match.index), this)
        );
      }

      this.compile(match.text);

      hasMatch = true;
      characterIndex = match.index + match.text.length;
    });

    // Handle empty string case
    if (!hasMatch && this.text.length === 0) {
      this.push(initSnippet('', this));
    }

    // Add text node after last match
    if (characterIndex < this.text.length) {
      this.push(
        initSnippet(this.text.substring(characterIndex, this.text.length), this)
      );
    }

    this.editCompilation();
  }

  private compile(snippetString: string) {
    let snippet = initSnippet(snippetString, this);

    if (snippet instanceof Tabstop && !(snippet instanceof Placeholder)) {
      this.tabstops.addTabstop(snippet);
      this.push(snippet);
    } else if (snippet instanceof Placeholder) {
      this.tabstops.addTabstop(snippet);
      this.push(snippet);
      this.insertNestedTabstops(snippet);
    } else if (snippet instanceof SnippetFunction) {
      this.compileDynamicFunctions(snippet);
    } else {
      this.push(snippet);
    }
  }

  editCompilation() {
    for (let walker = this.head, index = 0; walker !== null; index++) {
      let next = walker.next;
      let orderChanged = false;

      if (
        walker.value instanceof Expansion ||
        walker.value instanceof Incrementor
      ) {
        orderChanged = this.insertExpansions(walker.value, index);
      }

      if (orderChanged) {
        next = this.getNode(index);
        index--;
      }

      walker = next;
    }
  }

  private insertExpansions(snippet, index) {
    const expansion = snippet.expand(this.references);

    if (expansion) {
      // Insert tabstops into TabstopList
      if (expansion.tabstops.length > 0) {
        this.tabstops.push(expansion.tabstops.toArray());
        this.tabstops.updateNodeReferences();
      }

      // Insert all element is into the parsed list
      this.splice(index, 1, ...expansion.toArray());

      return true;
    }
    return false;
  }

  private insertNestedTabstops(snippet) {
    if (snippet.nested.tabstops.length > 0) {
      this.tabstops.push(snippet.nested.tabstops.toArray());
      this.tabstops.updateNodeReferences();
    }
  }

  private compileDynamicFunctions(snippet: SnippetFunction) {
    this.push(initSnippet(snippet.transform, this));
  }

  serialize(): string {
    let serialized = '';

    this.forEach(element => {
      serialized += element.text;
    });

    return serialized;
  }

  toString(): string {
    return this.serialize();
  }
}
