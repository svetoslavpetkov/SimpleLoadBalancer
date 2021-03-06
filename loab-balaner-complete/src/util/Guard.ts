class ValidationError extends Error {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, context: any) {
    super(message)
    this.name = "ValidationError"
    this.context = context
    this.message = message
  }
}

export default class Guard {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static should(rule: boolean, msg: string, context: any = {}): void {
    if (!rule) {
      throw new ValidationError(msg, context)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static exists(obj: any, msg: string, context: any = {}): void {
    Guard.should(!!obj, msg, context)
  }

  static notExists(obj: any, msg: string, context: any = {}): void {
    Guard.should(obj === null || obj === undefined, msg, context)
  }

  static ensure<T>(value: T | undefined | null, msg: string): T {
    if (value === undefined || value === null) {
      throw new Error(msg)
    }
    return value
  }
}
