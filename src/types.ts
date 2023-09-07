export type AnyFunction = (...args: any[]) => any
export type Constructor<T> = new (...args: any[]) => T
export type AnyConstructor = Constructor<any>


export type InstanceOf<C> = C extends Constructor<infer T> ? T : never
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<any, any> ? DeepPartial<T[K]> : T[K]
}

export type TypedClassDecorator<T extends AnyConstructor> = (target: T) => T | void
export type TypedMethodDecorator<T extends AnyFunction> = (target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void