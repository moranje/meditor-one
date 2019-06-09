import {
  Snippet,
  Placeholder,
  Selection,
  Marker,
  EditableMarker,
  Choice,
} from './classes'

interface Position {
  column: number
  lineNumber: number
}

function groupByIndex(list) {
  let prevIndex = -1
  let buckets = []

  list.sort(Placeholder.compareByIndex)
  list.forEach(placeholder => {
    if (prevIndex === placeholder.index) {
      buckets[buckets.length - 1].push(placeholder)
    } else {
      prevIndex = placeholder.index
      buckets.push([placeholder])
    }
  })

  return buckets
}

function splice(
  string: string,
  index: number,
  count: number,
  add: string = ''
) {
  return string.slice(0, index) + add + string.slice(index + count)
}

export default class SnippetSession {
  private readonly _snippet: Snippet
  private _markerBuckets: Marker[][]
  _markerBucketIndex: number

  constructor(snippet: Snippet) {
    this._snippet = snippet

    this._markerBuckets = groupByIndex(this._snippet.placeholders)
    this._markerBucketIndex = -1
  }

  get isAtFirstPlaceholder() {
    return this._markerBucketIndex <= 0 || this._markerBuckets.length === 0
  }

  get isAtLastPlaceholder() {
    return this._markerBucketIndex === this._markerBuckets.length - 1
  }

  get hasPlaceholder() {
    return this._snippet.placeholders.length > 0
  }

  // eslint-disable-next-line
  get choice(): Choice | undefined {
    if (this._markerBuckets[this._markerBucketIndex][0] instanceof Choice) {
      return this._markerBuckets[this._markerBucketIndex][0] as Choice
    }
  }

  // TODO: this should be called when text changes in the editor
  onTextChanged(offset: number, overwrite: number, input?: string) {
    if (this._markerBucketIndex !== -1) {
      let snippet = this._snippet.toText()
      let [first] = this._markerBuckets[this._markerBucketIndex]
      let selection = this._snippet.selection(first)
      let current = selection.slice(snippet)

      if (!input && overwrite > first.length) {
        overwrite = first.length
        console.warn(
          `Can't delete characters beyond selection, adjusted to full length of selection`
        )
      }

      if (input && overwrite > current.length) {
        overwrite = current.length
        console.warn(
          `Tried overwriting more characters than the markers length, adjusted overwrite to full marker length`
        )
      }

      let changed = splice(
        current,
        offset - selection.offsetStart,
        overwrite,
        input
      )

      for (const marker of this._markerBuckets[
        this._markerBucketIndex
      ] as EditableMarker[]) {
        marker.edit(changed)
        // marker.resolve({}, this._snippet)

        // Refresh buckets after text insertions or deletions
        this._snippet.clearPlaceholderCache()
        this._markerBuckets = groupByIndex(this._snippet.placeholders)
      }
    }
  }

  move(fwd: boolean): Selection[] {
    let skipThisPlaceholder = false
    if (
      fwd === true &&
      this._markerBucketIndex < this._markerBuckets.length - 1
    ) {
      this._markerBucketIndex += 1
    } else if (fwd === false && this._markerBucketIndex > 0) {
      this._markerBucketIndex -= 1
    } else {
      // the selection of the current placeholder might
      // not be acurate any more -> simply restore it
    }

    const selections: Selection[] = []
    for (const placeholder of this._markerBuckets[this._markerBucketIndex]) {
      let selection = this._snippet.selection(placeholder)

      // NOTE: this means the user probably deleted this placeholder and
      // therefore should be skipped
      if (selection.isEmpty() && placeholder.toText().length > 0) {
        skipThisPlaceholder = true
      } else {
        selections.push(selection)
      }
    }

    return !skipThisPlaceholder ? selections : this.move(fwd)
  }

  // Void because extending class may not need to return anything

  merge(template: string, context?: any) {}

  prev(): Selection[] | void {
    return this.move(false)
  }

  next(): Selection[] | void {
    return this.move(true)
  }
}
