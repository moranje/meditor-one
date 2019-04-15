import Marker from '@/components/Shared/Editor/snippet/classes/marker'
import Transform from '@/components/Shared/Editor/snippet/classes/transform'

export default abstract class TransformableMarker extends Marker {
  public transform: Transform
  // protected _model: string
  // Should return the text inside marker boundaries. May change as the user
  // edits text. Used to compare marker content for actions. Needs to be synced
  // with user input somehow.
  // abstract get model(): string
  // abstract set model(text: string)
}
