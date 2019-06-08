import { Snippet } from '@/components/Shared/Editor/snippet/classes'
import uniqid from 'uniqid'

export default abstract class Marker {
  private _parent: Marker
  protected _children: Marker[]
  public id = uniqid()

  constructor(public type: string, children: Marker[] = []) {
    if (children) {
      try {
        children.forEach(child => (child.parent = this))
      } catch (err) {
        // console.log(
        //   'constructor()',
        //   children,
        //   Array.isArray(children),
        //   children.forEach
        // )
        // console.error(err)
      }
    }

    this._children = children
  }

  get children(): Marker[] {
    return this._children
  }

  get parent() {
    return this._parent
  }

  get length() {
    return `${this.toText()}`.length
  }

  set parent(marker: Marker) {
    this._parent = marker
  }

  walk(markers: Marker[], visitor: (marker: Marker) => boolean): void {
    // TODO: consider memoizing this when markers is unchanged (but don't)
    // optimize prematurely
    const stack = [...markers]

    while (stack.length > 0) {
      // In-order traversal
      const marker = stack.shift()!
      stack.unshift(...marker.children)
      const recurse = visitor(marker)

      if (!recurse) {
        break
      }
    }
  }

  resolve(context: any, root: Snippet) {
    this.walk(this.children, child => {
      if (context) child.resolve(context, root)

      // Keep walking
      return true
    })
  }

  abstract clone(children: Marker[]): Marker
  abstract toString(): string
  abstract toText(): string // Strip all
  // abstract toJSON(): any
}
