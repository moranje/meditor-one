export default class M1Error extends Error {
  constructor(message: string, type: string) {
    super(message)

    this.name = type || this.constructor.name

    // @ts-ignore
    if (typeof Error.captureStackTrace === 'function') {
      // @ts-ignore
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = new Error(message).stack
    }
  }
}
