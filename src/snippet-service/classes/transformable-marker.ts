import {
  EditableMarker,
  Transform,
} from '@/snippet-service/classes'

export default abstract class TransformableMarker extends EditableMarker {
  public transform: Transform
  // protected _model: string
  // Should return the text inside marker boundaries. May change as the user
  // edits text. Used to compare marker content for actions. Needs to be synced
  // with user input somehow.
  // abstract get model(): string
  // abstract set model(text: string)
}
