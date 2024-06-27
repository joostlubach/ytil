import { every } from 'lodash'

import { objectValues } from './lodashext'

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
 */
export abstract class EnumUtil {

  public static names(Enum: AnyEnumType): string[] {
    if (this.isStringEnum(Enum)) {
      return Object.keys(Enum)
    } else {
      const count = Object.keys(Enum).length
      return objectValues(Enum).slice(0, count / 2) as string[]
    }
  }

  public static values<E extends AnyEnumType>(Enum: E): EnumValue<E>[] {
    if (this.isStringEnum(Enum)) {
      return objectValues(Enum) as EnumValue<E>[]
    } else {
      const count = Object.keys(Enum).length
      return objectValues(Enum).slice(count / 2) as EnumValue<E>[]
    }
  }

  public static isStringEnum(Enum: AnyEnumType): Enum is EnumTypeOf<string> {
    return every(
      Object.entries(Enum),
      ([key, value]) => typeof key === 'string' && typeof value === 'string',
    )
  }

  public static coerce<E extends AnyEnumType>(Enum: E, value: unknown): EnumValue<E> | undefined {
    if (this.values(Enum).includes(value as EnumValue<E>)) {
      return value as EnumValue<E>
    }
  }

}

/**
 * A formal type definition of `typeof EnumType`.
 */
export type EnumTypeOf<V extends string | number> =
  V extends number ? Record<string, V> & Record<V, string> :
    V extends string ? Record<string, V> : never

/**
 * Catch-all for unknown enum.
 */
export type AnyEnumType = EnumTypeOf<string | number>

/**
 * Extract enum names.
 */
export type EnumName<E extends AnyEnumType> =
  E extends Record<infer T, unknown> ? T : never

/**
 * Extract enum value.
 *
 * - `EnumValue<typeof StringEnum> === StringEnum`
 * - `EnumValue<typeof NumberEnum> === NumberEnum`
 */
export type EnumValue<E extends AnyEnumType> =
  E extends Record<string, infer T extends string> ? T :
    E extends Record<string, infer T> ? Exclude<T, string> :
      never
