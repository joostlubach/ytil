export abstract class EnumUtil {

  public static names<V>(enumType: Record<string, V>): string[] {
    const count = Object.keys(enumType).length
    return Object.values(enumType).slice(0, count / 2) as string[]
  }

  public static values<V>(enumType: Record<string, V>): V[] {
    const count = Object.keys(enumType).length
    return Object.values(enumType).slice(count / 2) as V[]
  }

}