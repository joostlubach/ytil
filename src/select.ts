export function select<V>(key: string | null | undefined, map: {[key: string]: V, default: V}): V
export function select<V>(key: string | null | undefined, map: {[key: string]: V}): V | undefined
export function select(key: string | null | undefined, map: AnyObject) {
  if (key && map.hasOwnProperty(key)) {
    return map[key]
  } else if (map.hasOwnProperty('default')) {
    return map.default
  } else {
    return null
  }
}