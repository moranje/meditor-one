# Snippet Documentation

## Marker

``` ts
interface Marker {
  length: number;
  parent: Marker;
  children: Marker[];
  template: string;
  appendChild: (child: Marker) => this;
  replace: (child: Marker, others: Marker[]) => void;
  clone: () => Marker;
  toString: () => string;
  resolve: (context: { snippets: SnippetFile[], actions: Action[] }) => SnippetAST;
}
```

## Snippet

``` ts
interface Snippet extends Marker {
  private placeholders: Placeholder[]
  // Throw error when adding a placeholder with a different cursorIndex
  // with the same name.
  addPlaceholder: (placeholder: Placeholder) => this;
}
```

## Placeholder

``` ts
interface Placeholder extends Marker {
  index: number;
  cursorIndex: number;
  // Important: names MUST differ between cursorIndices
  name?: string;
  body?: Snippet
  isFinalTabstop: number;
  constructor(index: string, name?: string, body?: string)
}
```

### Anatomy

#### Simple Placeholder

`$1` ... `$n`

`$1<name>` ... `$n`

Where `1`is the **index**

#### Complex Placeholder

`${1:placeholder}`

`${1<name>:placeholder}`

`${1:${2:child}}`

Where `1`is the **reference** and `placeholder` is the **body**

## Choice

`${1:One,Two,Three}`

`${1<name>:One,Two,Three}`

`${1<name>:$1,${!expansion},Three}`

## Variable

`$<name>`

`${name:placeholder}`



## Transform



## Expansion

`${!expansion}`

`${!expansion:$1:$n}`



## Slot

`${!1}`



## Action

`${#NAME:$1:$n}`

`${#DATE:hh-mm}`

`${#NAME<$1>:$1:$n}`

`${#NAME<$name>:$1:$n}`

## Expressions

`${1:=:output}`

`${name:!=:output}`

## Operators

`${...}|${...}=$1`

`${...}&${...}=${!expansion}`
