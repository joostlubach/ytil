export type AnyFunction = (...args: unknown[]) => unknown
export type Constructor<T, A extends unknown[] = unknown[]> = new (...args: A) => T
export type AnyConstructor = Constructor<unknown>

export type InstanceOf<C> = C extends Constructor<infer T> ? T : never
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<ObjectKey, unknown> ? DeepPartial<T[K]> : T[K]
}
export type SomePartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type TypedClassDecorator<T extends AnyConstructor> = (target: T) => T | void
export type TypedMethodDecorator<T extends AnyFunction> = (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void

export type UnknownObject = Record<ObjectKey, unknown>
export type ObjectKey = string | number | symbol
export type Primitive = string | number | boolean
