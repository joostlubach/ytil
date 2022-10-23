import { isArray } from 'lodash'

export abstract class MapBuilder {

  public static by<It, K>(items: It[], keyForItem: (item: It) => K): Map<K, It>
  public static by<It, K, V>(items: It[], keyForItem: (item: It) => K, valueForItem: (value: It) => V): Map<K, V>
  public static by<It, K, V = It>(items: It[], keyForItem: (item: It) => K, valueForItem?: (value: It) => V): Map<K, V> {
    const result = new Map<K, V>()
    for (const item of items) {
      const key   = keyForItem(item)
      const value = valueForItem == null ? (item as any as V) : valueForItem(item)
      result.set(key, value)
    }
    return result
  }

  public static groupBy<It, K>(items: It[], keyForItem: (item: It) => K): Map<K, It[]>
  public static groupBy<It, K, V>(items: It[], keyForItem: (item: It) => K, valueForItem: (value: It) => V): Map<K, V[]>
  public static groupBy<It, K, V>(items: It[], keyForItem: (item: It) => K | K[], valueForItem?: (value: It) => V): Map<K, V[]> {
    const result = new Map<K, V[]>()

    for (const item of items) {
      const key   = keyForItem(item)
      const keys  = isArray(key) ? key : [key]
      const value = valueForItem == null ? (item as any as V) : valueForItem(item)

      for (const key of keys) {
        const resultItem = result.get(key) ?? []
        result.set(key, resultItem)

        resultItem.push(value)
      }
    }

    return result
  }

}