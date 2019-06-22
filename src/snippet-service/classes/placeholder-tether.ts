import Tether from './tether'

export default abstract class PlaceholderTether extends Tether {
  public index: number = -1

  raiseIndexBy(by: number): void {
    if (this.index === -1) {
      throw new Error(
        `Object index should be 0  or higher, was ${this.index}. That probably means it wasn't initialized as it's supposed to.`
      )
    } else if (typeof by !== 'number') {
      throw new Error(`The argument must a number was ${by} (${typeof by}).`)
    } else if (typeof this.index === 'number') {
      this.index += by
    } else {
      throw new Error(
        `Tried to raise index of ${this} however it's index was't set to a valid number.`
      )
    }
  }
}
