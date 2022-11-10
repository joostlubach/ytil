export function superConstructor(ctor: AnyConstructor) {
  const superProto = Object.getPrototypeOf(ctor.prototype)
  return superProto?.constructor ?? null
}