import { isArray } from 'lodash'

export abstract class MapBuilder {

  public static firsts<It, K>(items: readonly It[], keyForItem: (item: It) => K): Map<K, It>
  public static firsts<It, K, V>(items: readonly It[], keyForItem: (item: It) => K, valueForItem: (value: It) => V): Map<K, V>
  public static firsts<It, K, V = It>(items: readonly It[], keyForItem: (item: It) => K, valueForItem?: (value: It) => V): Map<K, V> {
    const result = new Map<K, V>()
    for (const item of items) {
      const key = keyForItem(item)
      if (result.has(key)) { continue }

      const value = valueForItem == null ? (item as unknown as V) : valueForItem(item)
      result.set(key, value)
    }
    return result
  }

  public static lasts<It, K>(items: readonly It[], keyForItem: (item: It) => K): Map<K, It>
  public static lasts<It, K, V>(items: readonly It[], keyForItem: (item: It) => K, valueForItem: (value: It) => V): Map<K, V>
  public static lasts<It, K, V = It>(items: readonly It[], keyForItem: (item: It) => K, valueForItem?: (value: It) => V): Map<K, V> {
    const result = new Map<K, V>()
    for (const item of items) {
      const key = keyForItem(item)
      const value = valueForItem == null ? (item as unknown as V) : valueForItem(item)
      result.set(key, value)
    }
    return result
  }

  public static groupBy<It, K>(items: readonly It[], keyForItem: (item: It) => K): Map<K, readonly It[]>
  public static groupBy<It, K, V>(items: readonly It[], keyForItem: (item: It) => K, valueForItem: (value: It) => V): Map<K, V[]>
  public static groupBy<It, K, V>(items: readonly It[], keyForItem: (item: It) => K | K[], valueForItem?: (value: It) => V): Map<K, V[]> {
    const result = new Map<K, V[]>()

    for (const item of items) {
      const key = keyForItem(item)
      const keys = isArray(key) ? key : [key]
      const value = valueForItem == null ? (item as unknown as V) : valueForItem(item)

      for (const key of keys) {
        const resultItem = result.get(key) ?? []
        result.set(key, resultItem)

        resultItem.push(value)
      }
    }

    return result
  }

  public static setDefault<K, V>(map: Map<K, V>, key: K, defaultValue: V): V {
    const value = map.get(key)
    if (value != null) { return value }

    map.set(key, defaultValue)
    return defaultValue
  }

}
