export function select<V>(key: string | null | undefined, map: { [key: string]: V, default: V }): V
export function select<V>(key: string | null | undefined, map: { [key: string]: V }): V | undefined
export function select(key: string | null | undefined, map: Record<string, any>) {
  if (key && key in map) {
    return map[key]
  } else if ('default' in map) {
    return map.default
  } else {
    return null
  }
}