import { isFunction } from '../functions'

/**
 * Memoizes the return value of a function or property getter.
 */
export function memoized(_target: object, propertyKey: string, descriptor: PropertyDescriptor) {
  if ('get' in descriptor && descriptor.get != null) {
    return memoizedProperty(propertyKey, descriptor, descriptor.get)
  } else if ('value' in descriptor && isFunction(descriptor.value)) {
    return memoizedMethod(propertyKey, descriptor, descriptor.value)
  } else {
    throw new Error('@memoized can only be applied to methods or property getters')
  }
}

function memoizedProperty(propertyKey: string, descriptor: PropertyDescriptor, getter: () => any) {
  descriptor.get = function (this: any) {
    // Get the value from the getter the first time.
    const value = getter.call(this)

    // Redefine the property with this cached value.
    Object.defineProperty(this, propertyKey, {
      value,
      writable: false,
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable
    })

    return value
  }
  return descriptor
}

function memoizedMethod(propertyKey: string, descriptor: PropertyDescriptor, fn: () => any) {
  descriptor.value = function (this: any) {
    // Get the value from the getter the first time.
    const value = fn.call(this)

    // Redefine the property with a simple function returning this cached value.
    Object.defineProperty(this, propertyKey, {
      value: () => value,
      writable: false,
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable
    })

    return value
  }
  return descriptor
}