/* eslint-disable @typescript-eslint/ban-types */

import { AnyConstructor, Constructor } from './types'

export function resolveConstructor(arg: any) {
  if (typeof arg === 'function' && arg.prototype != null) {
    return arg
  }
  if (typeof arg === 'object' && arg.constructor != null) {
    return arg.constructor
  }

  throw new Error(`Expected a class or class instance (constructor or prototype): ${arg}`)
}

export function superConstructor(ctor: AnyConstructor) {
  const superProto = Object.getPrototypeOf(ctor.prototype)
  return superProto?.constructor ?? null
}

export function createConstructorWithName<T extends Constructor<unknown>>(name: string, superConstructor?: T): T
// Create an overload with just Function as argument name to support creating classes with an abstract base class.
export function createConstructorWithName<T>(name: string, superConstructor: Constructor<T>): Constructor<T>

export function createConstructorWithName<T>(name: string): Constructor<unknown>
export function createConstructorWithName(name: string, superConstructor?: Constructor<any> | Function): Constructor<any> {
  // Yay I came up with a trick to create a class with a run-time name.
  // Assign the class to some object with the given name as key. Then extract it again and lo and behold, it
  // has a name!
  const ns = {
    [name]: superConstructor == null
      ? class {}
      : class extends (superConstructor as Constructor<any>) {},
  }

  return ns[name]
}
