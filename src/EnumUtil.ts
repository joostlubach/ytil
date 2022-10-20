export abstract class EnumUtil {

  public static names<V>(enumType: Record<string, V>): string[] {
    return Object.keys(enumType)
  }

  public static values<V>(enumType: Record<string, V>): V[] {
    return Object.values(enumType)
  }

}