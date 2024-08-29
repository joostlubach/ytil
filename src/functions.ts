import { AnyFunction } from './types'

export function isFunction<F extends(...args: any[]) => any>(fn: any): fn is F {
  return typeof fn === 'function'
}

export function hasMethod<O extends object, K extends string | number | symbol>(obj: O, name: K): obj is O & Record<K, AnyFunction> {
  if (obj == null) { return false }
  if (!(name in obj)) { return false }
  return isFunction((obj as any)[name])
}