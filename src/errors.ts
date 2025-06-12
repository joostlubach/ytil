import 'error-polyfill'

export function panic(message: string): never {
  const error = new Error(message)
  Error.captureStackTrace(error, panic)
  throw error
}

declare global {
  interface ErrorConstructor {
    captureStackTrace(targetObject: object, constructorOpt?: Function): void
  }
  interface Error {
    cause?: unknown
  }
  interface String {
    toError(): Error
  }
  
}