import 'error-polyfill'

export function panic(message: string) {
  const error = new Error(message)
  Error.captureStackTrace(error, panic)
  throw error
}