export type AnyFunction = (...args: any[]) => any
export type Constructor<T, A extends any[] = any[]> = new (...args: A) => T
export type AbstractConstructor<T, A extends any[] = any[]> = abstract new (...args: A) => T
export type AnyConstructor = Constructor<unknown>
export type ConstructorParams<C extends AnyConstructor> = C extends new (...args: infer A) => void ? A : never

type _FixedArray<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _FixedArray<T, N, [T, ...R]>
export type FixedArray<T, N extends number> = _FixedArray<T, N, []>

export type Primitive = string | number | boolean
type Builtin =
  | Primitive
  | Date
  | RegExp
  | Error
  | Function;

// tuple detection (so tuples keep their shape)
type _IsTuple<T extends readonly unknown[]> = number extends T["length"] ? false : true;

export type DeepPartial<T> =
  // don't recurse into builtins
  T extends Builtin ? T :

  // collections
  T extends Map<infer K, infer V> ? Map<K, DeepPartial<V>> :
  T extends ReadonlyMap<infer K, infer V> ? ReadonlyMap<K, DeepPartial<V>> :
  T extends Set<infer U> ? Set<DeepPartial<U>> :
  T extends ReadonlySet<infer U> ? ReadonlySet<DeepPartial<U>> :

  // arrays / tuples (incl readonly)
  T extends readonly (infer U)[] ?
    _IsTuple<T> extends true
      ? { [K in keyof T]?: DeepPartial<T[K]> } // tuple: keep indices, make optional
      : ReadonlyArray<DeepPartial<U>> // array: recurse element
  :

  // objects
  T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } :

  // fallback
  T;

  

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