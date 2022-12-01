export const MapUtil = {

  sparse<K extends PropertyKey, V>(map: Map<K, V | null | undefined>): Map<K, V> {
    const result = new Map<K, V>()
    for (const [key, value] of map.entries()) {
      if (value == null) { continue }
      result.set(key, value)
    }
    return result
  },

  mapToObject<K extends PropertyKey, V>(map: Map<K, V>): Record<K, V> {
    return Object.fromEntries(map.entries())
  },


}