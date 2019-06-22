import {
  Marker,
  Snippet,
  Text,
  Choice,
} from '@/snippet-service/classes'

export default abstract class EditableMarker extends Marker {
  get children() {
    return this._children
  }

  // Children need to be editable as well
  set children(children: Marker[]) {
    this._children = children
  }

  get snippet(): Snippet | null {
    if (this.children[0] instanceof Snippet) return this.children[0] as Snippet

    return null
  }

  edit(input) {
    let text = new Text(input)

    // @ts-ignore
    if (this.block !== undefined) this.block = true

    if (this instanceof Choice) {
      this.updateIndex(input)
    } else if (this.snippet) {
      this.snippet.children = [text]
    } else {
      this.children = [text]
    }
  }
}
