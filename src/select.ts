export function select<M>(key: keyof M, map: M): M[keyof M] {
  return map[key]
}
