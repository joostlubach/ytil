import { isFunction } from '../functions'

/**
 * Memoizes the return value of a function or property getter.
 */
export function memoized(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.get ?? descriptor.value
  if (!isFunction(original)) {
    throw new Error('@memoized can only be applied to methods or property getters')
  }

  const cacheKey = Symbol(`${propertyKey}(memoized)`)
  descriptor.value = function(this: any, ...args: any[]) {
    if (!this.hasOwnProperty(cacheKey)) {
      this[cacheKey] = original.apply(this, args)
    }
    return this[cacheKey]
  }
}