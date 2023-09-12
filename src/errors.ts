import 'error-polyfill'

export function panic(message: string): never {
  const error = new Error(message)
  Error.captureStackTrace(error, panic)
  throw error
}