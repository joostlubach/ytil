export abstract class MapUtil {

  public static sparse<K, V>(map: Map<K, V | null | undefined>): Map<K, V> {
    const result = new Map<K, V>()
    for (const [key, value] of map.entries()) {
      if (value == null) { continue }
      result.set(key, value)
    }
    return result
  }

  public static objectToMap<T extends object>(obj: T): Map<keyof T, T[keyof T]> {
    return new Map<keyof T, T[keyof T]>(Object.entries(obj) as [keyof T, T[keyof T]][])
  }

  public static mapToObject<K extends PropertyKey, V>(map: Map<K, V>): Record<K, V> {
    return Object.fromEntries(map.entries()) as Record<K, V>
  }

  public static ensure<K, V>(map: Map<K, V>, key: K, defaultValue: () => V): V
  public static ensure<K extends object, V>(map: WeakMap<K, V>, key: K, defaultValue: () => V): V
  public static ensure(map: Map<unknown, unknown> | WeakMap<object, unknown>, key: object | unknown, defaultValue: () => unknown) {
    const value = map.get(key as object)
    if (value !== undefined) { return value }

    const newValue = defaultValue()
    map.set(key as object, newValue)
    return newValue
  }

}
