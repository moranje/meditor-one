import uniqid from 'uniqid'

export default abstract class Marker {
  public id = uniqid()

  constructor(
    public type: string,
    public parent: Marker = null,
    protected _children: Marker[] = []
  ) {}

  static walk(marker: Marker[], visitor: (marker: Marker) => boolean): void {
    const stack = [...marker]

    while (stack.length > 0) {
      const marker = stack.shift()!
      const recurse = visitor(marker)

      if (!recurse) {
        break
      }

      stack.unshift(...marker.children)
    }
  }

  get children(): Marker[] {
    return this._children
  }

  resolve(context) {
    this._children.forEach(child => child.resolve(context))
  }

  abstract clone(): Marker
  abstract toString(): string
  // abstract toText(): string // Strip all
  // abstract toJSON(): any
}
