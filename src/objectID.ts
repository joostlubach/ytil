const ids: WeakMap<object, number> = new WeakMap()

let nextID = 0

export function objectID(obj: unknown) {
  if (obj == null) { return obj }
  if (typeof obj !== 'object' && typeof obj !== 'function') { return obj }

  if (ids.has(obj)) {
    return ids.get(obj)
  }

  const id = nextID++
  ids.set(obj, id)
  return id
}
