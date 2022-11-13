import { every } from 'lodash'

export abstract class EnumUtil {

  public static names<V>(enumType: Record<string, V>): string[] {
    if (this.isIdentityMap(enumType)) {
      return Object.keys(enumType)
    } else {
      const count = Object.keys(enumType).length
      return Object.values(enumType).slice(0, count / 2) as string[]
    }
  }

  public static values<V>(enumType: Record<string, V>): V[] {
    if (this.isIdentityMap(enumType)) {
      return Object.values(enumType)
    } else {
      const count = Object.keys(enumType).length
      return Object.values(enumType).slice(count / 2) as V[]
    }
  }

  public static isIdentityMap(enumType: Record<string, any>) {
    return every(Object.entries(enumType), ([key, value]) => key === value)
  }

}