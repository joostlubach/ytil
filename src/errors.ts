import 'error-polyfill'

export function panic(message: string): never {
  const error = new Error(message)
  Error.captureStackTrace(error, panic)
  throw error
}

export function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  } else {
    return `${error}`
  }
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