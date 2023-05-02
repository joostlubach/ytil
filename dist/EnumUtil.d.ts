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
export declare abstract class EnumUtil {
    static names(Enum: AnyEnumType): string[];
    static values<E extends AnyEnumType>(Enum: E): EnumValue<E>[];
    static isStringEnum(Enum: AnyEnumType): Enum is EnumTypeOf<string>;
}
/**
 * A formal type definition of `typeof EnumType`.
 */
export type EnumTypeOf<V extends string | number> = V extends number ? Record<string, V> & Record<V, string> : V extends string ? Record<string, V> : never;
/**
 * Catch-all for any enum.
 */
export type AnyEnumType = EnumTypeOf<any>;
/**
 * Extract enum names.
 */
export type EnumName<E extends AnyEnumType> = E extends Record<infer T, any> ? T : never;
/**
 * Extract enum value.
 *
 * - `EnumValue<typeof StringEnum> === StringEnum`
 * - `EnumValue<typeof NumberEnum> === NumberEnum`
 */
export type EnumValue<E extends AnyEnumType> = E extends Record<string, string> ? E extends Record<string, infer T> ? T : E extends Record<string, infer T> ? Exclude<T, string> : never : never;
