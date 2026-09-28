import { every } from 'lodash'

/**
 * Generic utility for enum introspection.
 *
 * Enums are strange things in TypeScript. They come in two flavors:
 *
 *   1. String-based enums: `enum StringEnum { a = 'a', b = 'b' }`
 *   2. Number-based nums: `enum NumberEnum { a = 1, b = 2 }`
 *
 * String-based enums are sugar-coated `Record<string, string>`s, and number-based enums have a bi-directional
 * mapping: `Record<string, T> & Record<T, string> where T extends number`.
 *
 * Due to this, it's hard to figure out what the names and values are in a number-based enum. However, due the
 * way TS implements enums, the first `N / 2` entries in the Enum object are the forward mapping, and the latter
 * `N / 2` are the reverse mapping. We use this to provide proper introspection.
 *
 * Enums may be augmented with a namespace of the same name (e.g. `namespace StringEnum { export function f() {} }`).
 * Such function members are ignored.
 */
export abstract class EnumUtil {

  public static names<E extends AnyEnumType>(Enum: E): EnumName<E>[] {
    const entries = this.entries(Enum)
    if (this.isStringEnum(Enum)) {
      return entries.map(([key]) => key) as EnumName<E>[]
    } else {
      return entries.slice(0, entries.length / 2).map(([, value]) => value) as unknown[] as EnumName<E>[]
    }
  }

  public static values<E extends AnyEnumType>(Enum: E): EnumValue<E>[] {
    const entries = this.entries(Enum)
    if (this.isStringEnum(Enum)) {
      return entries.map(([, value]) => value) as EnumValue<E>[]
    } else {
      return entries.slice(entries.length / 2).map(([, value]) => value) as EnumValue<E>[]
    }
  }

  public static isStringEnum(Enum: AnyEnumType): Enum is EnumTypeOf<string> {
    return every(
      this.entries(Enum),
      ([key, value]) => typeof key === 'string' && typeof value === 'string',
    )
  }

  public static is<E extends AnyEnumType>(Enum: E, value: unknown): value is EnumValue<E> {
    return this.values(Enum).includes(value as EnumValue<E>)
  }

  public static coerce<E extends AnyEnumType>(Enum: E, value: unknown): EnumValue<E> {
    if (this.values(Enum).includes(value as EnumValue<E>)) {
      return value as EnumValue<E>
    } else {
      throw new TypeError(`Invalid enum value: ${value}`)
    }
  }

  private static entries(Enum: AnyEnumType): Array<[string, string | number]> {
    return Object.entries(Enum).filter((entry): entry is [string, string | number] => (
      typeof entry[1] !== 'function'
    ))
  }

}

/**
 * A formal type definition of `typeof EnumType`.
 */
export type EnumTypeOf<V extends string | number> =
  V extends number ? Record<string | V, string | V | EnumAugmentation> :
    V extends string ? Record<string, V | EnumAugmentation> : never

/**
 * A member added to an enum through a namespace augmentation.
 */
export type EnumAugmentation = (...args: any[]) => any

/**
 * Catch-all for unknown enum.
 */
export type AnyEnumType = EnumTypeOf<string> | EnumTypeOf<number>

/**
 * Extract enum names.
 */
export type EnumName<E extends AnyEnumType> =
  E extends Record<infer T, unknown> ? Exclude<T, AugmentationName<E>> : never

type AugmentationName<E extends AnyEnumType> = {
  [K in keyof E]: E[K] extends EnumAugmentation ? K : never
}[keyof E]

/**
 * Extract enum value.
 *
 * - `EnumValue<typeof StringEnum> === StringEnum`
 * - `EnumValue<typeof NumberEnum> === NumberEnum`
 */
export type EnumValue<E extends AnyEnumType> =
  E extends Record<string, infer T> ?
    [Exclude<T, EnumAugmentation>] extends [string] ? Exclude<T, EnumAugmentation> :
      Exclude<T, string | EnumAugmentation> :
    never