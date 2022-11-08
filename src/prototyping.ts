export function superConstructor(ctor: Function) {
  const superProto = Object.getPrototypeOf(ctor.prototype)
  return superProto?.constructor ?? null
}