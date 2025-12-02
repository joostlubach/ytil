import { AnyFunction } from './types'

export function isFunction<F extends(...args: any[]) => any>(value: any): value is F {
  return typeof value === 'function'
}

export function hasMethod<T, K extends string>(
  receiver: T,
  name: K,
  length?: number,
): receiver is T & Record<K, () => void> {
  if (receiver == null || typeof receiver !== 'object') {
    return false
  }
  
  const method = (receiver as Record<K, unknown>)[name]
  
  if (!isFunction(method)) {
    return false
  }
  
  if (length !== undefined && method.length !== length) {
    return false
  }
  
  return true
}
export function tap<T, U>(source: T | (() => T), tap: (value: T) => U): U {
  const value = isFunction(source) ? source() : source
  return tap(value)
}

export function bindMethods<O extends object>(obj: O, options: BindMethodOptions = {}) {
  const {only, except, enumerable = false} = options

  const isIncluded = (key: string | number | symbol) => {
    if (builtInKeys.includes(key)) { return false }

    if (only && !filterContains(only, key)) { return false }
    if (except && filterContains(except, key)) { return false }
    return true
  }

  let current = obj

  while (current != null && current !== Object.prototype) {
    const keys = [
      ...Object.getOwnPropertyNames(current),
      ...Object.getOwnPropertySymbols(current),
    ]
    
    for (const key of keys) {
      if (!isIncluded(key)) { continue }

      const prop = Object.getOwnPropertyDescriptor(current, key)
      if (prop == null) { continue }
      if (!isFunction(prop.value)) { continue }

      Object.defineProperty(obj, key, {
        ...prop,
        value: prop.value.bind(obj),
        enumerable,
      })
    }

    if (options.recurse === false && current !== obj) { break }
    current = Object.getPrototypeOf(current)
  }
}

export function extfn<F extends AnyFunction, O>(fn: F, obj: O): F & O {
  Object.assign(fn, obj)
  return fn as F & O
}

const builtInKeys: Array<string | number | symbol> = ['constructor', 'prototype']

function filterContains(filter: string[] | RegExp, key: string | number | symbol) {
  const keyString = key.toString()
  if (filter instanceof RegExp) {
    return filter.test(keyString)
  } else {
    return filter.includes(keyString)
  }
}

export interface BindMethodOptions {
  only?:       string[] | RegExp
  except?:     string[] | RegExp
  recurse?:    boolean
  enumerable?: boolean
}
