import { AnyFunction } from './types'

export function isFunction<F extends(...args: any[]) => any>(fn: any): fn is F {
  return typeof fn === 'function'
}

export function hasFunction<O extends object, K extends string | number | symbol>(obj: O, key: K): obj is O & {[key in K]: AnyFunction} {
  if (!(key in obj)) { return false }
  if (!isFunction((obj as any)[key])) { return false }

  return true
}