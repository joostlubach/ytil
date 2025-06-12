export function enumerable(flag: boolean = true) {
  return function (_target: object, propertyKey: string, descriptor: PropertyDescriptor) {
    return {
      ...descriptor,
      enumerable: flag,
    }
  }
}