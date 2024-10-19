export type AnyFunction = (...args: any[]) => any
export type Constructor<T, A extends any[] = any[]> = new (...args: A) => T
export type AbstractConstructor<T, A extends any[] = any[]> = abstract new (...args: A) => T
export type AnyConstructor = Constructor<unknown>

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<any, any> ? DeepPartial<T[K]> : T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type TypedClassDecorator<T extends AnyConstructor> = (target: T) => T | void
export type TypedMethodDecorator<T extends AnyFunction> = (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void

export type CamelizeKeys<T> = {
  [K in keyof T as K extends string ? Camelize<K> : K]: T[K]
}

type Camelize<S extends string> = S extends `${infer Head}${'_' | '-' | ' '}${infer Tail}`
  ? `${Head}${Capitalize<Camelize<Tail>>}`
  : S

export type UnknownObject<K extends ObjectKey = ObjectKey> = Record<K, unknown>
export type EmptyObject<K extends ObjectKey = ObjectKey> = Record<K, never>

export type ObjectKey = string | number | symbol
export type Primitive = string | number | boolean

export type MethodKey<T> = {
  [K in keyof T]: T[K] extends AnyFunction ? K : never
}[keyof T]
