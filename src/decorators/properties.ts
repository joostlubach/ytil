/**
 * Sets the enumerable property of a class member.
 * Supports both experimental and modern decorator syntax.
 */
export function enumerable(flag: boolean = true) {
  // Overload signatures for modern decorators
  function decorator<T, V>(
    target: (this: T, ...args: any[]) => V,
    context: ClassMethodDecoratorContext<T, (this: T, ...args: any[]) => V>
  ): (this: T, ...args: any[]) => V
  
  function decorator<T, V>(
    target: (this: T) => V,
    context: ClassGetterDecoratorContext<T, V>
  ): (this: T) => V
  
  function decorator<T, V>(
    target: (this: T, value: V) => void,
    context: ClassSetterDecoratorContext<T, V>
  ): (this: T, value: V) => void
  
  // Overload signature for experimental decorators
  function decorator<T>(
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor
  
  // Implementation
  function decorator(target: any, context?: any, descriptor?: PropertyDescriptor): any {
    // Modern decorator syntax (context is an object with 'kind' property)
    if (context != null && typeof context === 'object' && 'kind' in context) {
      context.addInitializer(function (this: any) {
        const descriptor = Object.getOwnPropertyDescriptor(this, context.name)
        if (descriptor) {
          Object.defineProperty(this, context.name, {
            ...descriptor,
            enumerable: flag,
          })
        }
      })
      return target
    }
    
    // Experimental decorator syntax (context is propertyKey, descriptor is third arg)
    if ((typeof context === 'string' || typeof context === 'symbol') && descriptor != null) {
      descriptor.enumerable = flag
      return descriptor
    }
    
    throw new Error('@enumerable decorator called with invalid arguments')
  }
  
  return decorator
}