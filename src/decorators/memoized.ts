

/**
 * Memoizes the return value of a function or property getter.
 * Supports both experimental and modern decorator syntax.
 */
export function memoized<T, V>(
  target: (this: T) => V,
  context: ClassGetterDecoratorContext<T, V>
): (this: T) => V

export function memoized<T, A extends any[], V>(
  target: (this: T, ...args: A) => V,
  context: ClassMethodDecoratorContext<T, (this: T, ...args: A) => V>
): (this: T, ...args: A) => V

export function memoized<T>(
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): PropertyDescriptor

export function memoized(target: any, context?: any, descriptor?: PropertyDescriptor): any {
  // Modern decorator syntax (context is an object with 'kind' property)
  if (context != null && typeof context === 'object' && 'kind' in context) {
    if (context.kind === 'getter') {
      return function (this: any) {
        const value = target.call(this)
        Object.defineProperty(this, context.name, {
          value,
          writable:     false,
          enumerable:   true,
          configurable: true,
        })
        return value
      }
    } else if (context.kind === 'method') {
      return function (this: any, ...args: any[]) {
        const value = target.call(this, ...args)
        Object.defineProperty(this, context.name, {
          value:        () => value,
          writable:     false,
          enumerable:   true,
          configurable: true,
        })
        return value
      }
    } else {
      throw new Error('@memoized can only be applied to methods or getters')
    }
  }
  
  // Experimental decorator syntax (context is propertyKey, descriptor is third arg)
  if (typeof context === 'string' || typeof context === 'symbol') {
    const propertyKey = context
    
    if (descriptor == null) {
      throw new Error('@memoized requires a property descriptor')
    }
    
    // It's a getter
    if (descriptor.get != null) {
      const originalGetter = descriptor.get
      descriptor.get = function (this: any) {
        const value = originalGetter.call(this)
        Object.defineProperty(this, propertyKey, {
          value,
          writable:     false,
          enumerable:   descriptor.enumerable,
          configurable: descriptor.configurable,
        })
        return value
      }
      return descriptor
    }
    
    // It's a method
    if (descriptor.value != null && typeof descriptor.value === 'function') {
      const originalMethod = descriptor.value
      descriptor.value = function (this: any, ...args: any[]) {
        const value = originalMethod.call(this, ...args)
        Object.defineProperty(this, propertyKey, {
          value:        () => value,
          writable:     false,
          enumerable:   descriptor.enumerable,
          configurable: descriptor.configurable,
        })
        return value
      }
      return descriptor
    }
    
    throw new Error('@memoized can only be applied to methods or getters')
  }
  
  throw new Error('@memoized decorator called with invalid arguments')
}