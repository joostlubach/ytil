export type AnyFunction = (...args: any[]) => any
export type Constructor<T, A extends any[] = any[]> = new (...args: A) => T
export type AbstractConstructor<T, A extends any[] = any[]> = abstract new (...args: A) => T
export type AnyConstructor = Constructor<unknown>
export type ConstructorParams<C extends AnyConstructor> = C extends new (...args: infer A) => void ? A : never

type _FixedArray<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _FixedArray<T, N, [T, ...R]>
export type FixedArray<T, N extends number> = _FixedArray<T, N, []>

export type DeepPartial<T> = {
  [K in keyof T]?:
  T[K] extends Array<infer U> ? DeepPartial<U>[] :
    T[K] extends Function | Date | Number | String | Boolean ? T[K] :
      T[K] extends Record<any, any> ? DeepPartial<T[K]> :
        T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type MakeRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>
export type MakeReadonly<T, K extends keyof T> = Omit<T, K> & Readonly<Pick<T, K>>
export type MakeMutable<T, K extends keyof T> = Omit<T, K> & { -readonly [P in K]: T[P] }
export type Mutable<T> = { -readonly [P in keyof T]: T[P] }
export type Override<T, O> = Omit<T, keyof O> & { [P in keyof O]: O[P] }

export type TypedClassDecorator<T extends AnyConstructor> = (target: T) => T | void
export type TypedMethodDecorator<T extends AnyFunction> = (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void

export type CamelizeKeys<T> = {
  [K in keyof T as K extends string ? Camelize<K> : K]: T[K]
}

type Camelize<S extends string> = S extends `${infer Head}${'_' | '-' | ' '}${infer Tail}`
  ? `${Head}${Capitalize<Camelize<Tail>>}`
  : S

export type UnknownObject<K extends ObjectKey = ObjectKey> = Record<K, unknown>
export type EmptyObject = object & Record<never, never>

export type ObjectKey = string | number | symbol
export type Primitive = string | number | boolean

export type PropertiesOf<O extends object> = {
  [K in keyof O as O[K] extends AnyFunction | undefined ? never : K]: O[K]
}

export type MethodsOf<O extends object> = {
  [K in keyof O as O[K] extends AnyFunction | undefined ? K : never]: O[K]
}

export type MethodKey<T> = {
  [K in keyof T]: T[K] extends AnyFunction ? K : never
}[keyof T]


export type undefinedOptional<T> = {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K]
} & {
  [K in keyof T as undefined extends T[K] ? K : never]?: T[K]
}

export type nullableOptional<T> = {
  [K in keyof T as null extends T[K] ? never : K]: T[K]
} & {
  [K in keyof T as null extends T[K] ? K : never]?: T[K]
}

export type makeOptional<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P]
} & {
  [P in K]?: T[P]
}