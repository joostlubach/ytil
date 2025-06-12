import { isFunction } from '../functions'

/**
 * Memoizes the return value of a function or property getter.
 */
export function memoized(_target: object, propertyKey: string, descriptor: PropertyDescriptor) {
  if ('get' in descriptor) {
    return memoizedProperty(propertyKey, descriptor)
  } else if ('value' in descriptor && isFunction(descriptor.value)) {
    return memoizedMethod(propertyKey, descriptor)
  } else {
    throw new Error('@memoized can only be applied to methods or property getters')
  }
}

function memoizedProperty(propertyKey: string, descriptor: PropertyDescriptor) {
  const cacheKey = Symbol(`${propertyKey}(memoized)`)

  const original = descriptor.get
  if (original == null) { return descriptor }

  descriptor.get = function (this: any) {
    if (!this.hasOwnProperty(cacheKey)) {
      this[cacheKey] = original.call(this)
    }
    return this[cacheKey]
  }
  return descriptor
}

function memoizedMethod(propertyKey: string, descriptor: PropertyDescriptor) {
  const cacheKey = Symbol(`${propertyKey}(memoized)`)

  const original = descriptor.value
  if (original == null) { return descriptor }

  descriptor.value = function (this: any, ...args: any[]) {
    if (!this.hasOwnProperty(cacheKey)) {
      this[cacheKey] = original.call(this, ...args)
    }
    return this[cacheKey]
  }
  return descriptor
}