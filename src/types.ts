export type Constructor<A extends any[], T> = new (...args: A) => T
export type AnyConstructorOf<T> = Constructor<any, T>
export type AnyConstructor = AnyConstructorOf<any>
export type InstanceOf<C> = C extends AnyConstructorOf<infer T> ? T : never