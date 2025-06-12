export function enumerable(flag: boolean = true) {
  return function (_target: object, _propertyKey: string, descriptor: PropertyDescriptor) {
    return {
      ...descriptor,
      enumerable: flag,
    }
  }
}