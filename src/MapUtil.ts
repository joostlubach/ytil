export abstract class MapUtil {

  public static sparse<K extends PropertyKey, V>(map: Map<K, V | null | undefined>): Map<K, V> {
    const result = new Map<K, V>()
    for (const [key, value] of map.entries()) {
      if (value == null) { continue }
      result.set(key, value)
    }
    return result
  }

  public static mapToObject<K extends PropertyKey, V>(map: Map<K, V>): Record<K, V> {
    return Object.fromEntries(map.entries()) as Record<K, V>
  }

  public static ensure<K extends PropertyKey, V>(map: Map<K, V>, key: K, defaultValue: () => V): V
  public static ensure<K extends object, V>(map: WeakMap<K, V>, key: K, defaultValue: () => V): V
  public static ensure(map: Map<any, any> | WeakMap<any, any>, key: any, defaultValue: () => any) {
    const value = map.get(key)
    if (value !== undefined) { return value }

    const newValue = defaultValue()
    map.set(key, newValue)
    return newValue
  }

}