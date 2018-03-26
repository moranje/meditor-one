// Regexes
// snippets: \$\d+|\$\{.*?\}
// type: (\$\d+)|(\$\{\d+\})|\${(!)?([^:/|]+)(:|\/|\|).*?}
//

function parse(text = '') {
  if (/^\$\d+$/.test(text)) {
    return 'field';
  } else if (/^\$\{\d+\}$/.test(text)) {
    return 'field';
  } else if (/^\$\{\d+:.*?\}$/.test(text)) {
    return 'placeholder';
  } else if (/^\$\{\d+\|[^}]*?\|\}$/.test(text)) {
    return 'choice';
  } else if (/^\$\{[0-9a-zA-Z_]+\/[^}]*?\/[gmi]?\}$/.test(text)) {
    return 'substitution';
  } else if (/^\$\{!\d+:.*?\}$/.test(text)) {
    return 'expansion';
  }

  throw new Error(`Couldn't identfy snippet type: (${text})`);
}

function extractPosition(text, type) {
  if (type === 'field') {
    return +text.replace(/\$\{?(\d+)\}?/, '$1');
  } else if (type === 'placeholder') {
    return +text.replace(/\$\{(\d+):/, '$1');
  } else if (type === 'choice') {
    return +text.replace(/\$\{(\d+)\|/, '$1');
  } else if (type === 'expansion') {
    return +text.replace(/\$\{!(\d+):/, '$1');
  }

  return null;
}

class Snippet {
  constructor(text = '', start = 0) {
    this._start = start;
    this._text = text;
  }

  get length() {
    return this.text.length;
  }

  get text() {
    return this._text;
  }

  get start() {
    return this._start;
  }
}

class PositionSnippet extends Snippet {
  constructor(template, start, position = 0) {
    super(template, start);

    if (/^\d+$/.test(position) && typeof position === 'number') {
      this._position = position;
    } else {
      this._position = 0;
    }
  }

  get position() {
    return this._position;
  }

  set position(value) {
    if (/^\d+$/.test(value) && typeof value === 'number') {
      this._position = value;
    } else {
      throw new Error(
        `Property postion (${value}) must be a positive integer, was ${typeof value}`
      );
    }
    w;
  }

  incrementBy(number) {
    this.position += number;
  }
}

export class Field extends PositionSnippet {
  constructor(template, start, type = null) {
    super(template, start, extractPosition(template, type));

    this.type = type;
  }
}

export class Placeholder extends PositionSnippet {
  constructor(template, start, type = null) {
    super(template, start, extractPosition(template, type));

    this.type = type;
  }
}

export class Choice extends PositionSnippet {
  constructor(template, start, type = null) {
    super(template, start, extractPosition(template, type));

    this.type = type;
  }
}

export class Substitution extends Snippet {
  constructor(template, start, type = null) {
    super(template, start);

    this.type = type;
  }
}

export class Expansion extends PositionSnippet {
  constructor(template, start, type = null) {
    super(template, start, extractPosition(text, type));

    this.type = type;
  }
}

export default function factory(text, start) {
  const type = parse(text);

  if (type === 'field') {
    return new Field(text, start);
  } else if (type === 'placeholder') {
    return new Placeholder(text, start);
  } else if (type === 'substitution') {
    return new Substitution(text, start);
  } else if (type === 'choice') {
    return new Choice(text, start);
  } else if (type === 'expansion') {
    return new Expansion(text, start);
  }

  throw new Error(
    `Snippet factory function doesn't return anything, there is a logical error (text: ${text}, type: ${type})`
  );
}
