export function superConstructor(ctor: Function) {
  const superProto = ctor.prototype.__proto__
  return superProto?.constructor ?? null
}