export type Constructor<T> = new (...args: any[]) => T
export type AnyConstructor = Constructor<any>
export type InstanceOf<C> = C extends Constructor<infer T> ? T : never
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<any, any> ? DeepPartial<T[K]> : T[K]
}