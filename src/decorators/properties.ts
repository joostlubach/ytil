export function enumerable(flag: boolean = true) {
  return function(target: object, propertyKey: string, descriptor: PropertyDescriptor) {
    return {
      ...descriptor,
      enumerable: flag,
    }
  }
}