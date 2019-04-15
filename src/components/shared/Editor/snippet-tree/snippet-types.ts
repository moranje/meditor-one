import LinkedList from '@/components/Shared/Editor/snippet-tree/linked-list'

// *********************************
// * Expand AST
// *********************************
export declare type State = {
  // Scope[TabstopIndex[Id[]]]: The Id is used to track elements with the same
  // tabstopIndex.
  tabstopScope: number[][][]
  scopeStack: number[]
  elements: LinkedList
}
export declare type Node =
  | Snippet
  | Text
  | Comment
  | Tabstop
  | Placeholder
  | Choice
  | Variable
  | Expansion
  | ExpansionSlot
  | SnippetFunction
export declare type TabstopElement = Tabstop | Placeholder | Choice
declare type Snippet = {
  id: number
  type: string
  body: Node[]
}
declare type StringOrExpansion = string | Expansion
export declare type Text = {
  id: number
  type: string
  value: string
}
export declare type Comment = {
  id: number
  type: string
  value: string
}
export declare type Tabstop = {
  id: number
  type: string
  int: number
  modifier: string
  block: boolean
}
export declare type Placeholder = {
  id: number
  type: string
  int: number
  modifier: string
  body: Snippet[]
}
export declare type Choice = {
  id: number
  type: string
  int: number
  modifier: string
  body: StringOrExpansion[]
}
export declare type Variable = {
  id: number
  type: string
}
export declare type Transform = {
  type: string
  subtype: string
  reference: string
  pattern: string
  replacement: any[]
  flags: string
}
export declare type Expansion = {
  id: number
  type: string
  reference: string
  body: Snippet[]
  args: string[]
}
export declare type ExpansionSlot = {
  id: number
  type: string
}
export declare type SnippetFunction = {
  id: number
  type: string
}
