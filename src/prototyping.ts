export function superConstructor(ctor: AnyConstructor) {
  const superProto = Object.getPrototypeOf(ctor.prototype)
  return superProto?.constructor ?? null
}

export function createConstructorWithName<T extends Constructor<any>>(name: string, superConstructor?: T): T

// Create an overload with just Function as argument name to support creating classes with an abstract base class.
export function createConstructorWithName<T extends Constructor<any>>(name: string, superConstructor?: Function): T

export function createConstructorWithName(name: string, superConstructor?: any) {
  // Yay I came up with a trick to create a class with a run-time name.
  // Assign the class to some object with the given name as key. Then extract it again and lo and behold, it
  // has a name!
  const ns = {
    [name]: class extends (superConstructor ?? Object) {},
  }

  return ns[name]
}