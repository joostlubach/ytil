import { isFunction } from 'ytil'

export function isPromise<R>(arg: unknown, strict: false): arg is PromiseLike<R>
export function isPromise<R>(arg: unknown, strict?: true): arg is Promise<R>
export function isPromise(arg: unknown, strict = true) {
  if (arg == null) { return false }
  if (!isFunction((arg as PromiseLike<unknown>).then)) { return false }

  if (strict && !isFunction((arg as Promise<unknown>).catch)) { return false }
  if (strict && !isFunction((arg as Promise<unknown>).finally)) { return false }

  return true
}

export function wrapInPromise<T>(arg: T | Promise<T>): Promise<T> {
  if (isPromise(arg)) {
    return arg
  } else {
    return Promise.resolve(arg)
  }
}
