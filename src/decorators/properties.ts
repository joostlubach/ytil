export function enumerable(flag: boolean = true) {
  return function <T>(target: any, context: ClassMethodDecoratorContext | ClassGetterDecoratorContext | ClassSetterDecoratorContext) {
    context.addInitializer(function() {
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
}