import { every } from 'lodash';
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
export class EnumUtil {
    static names(Enum) {
        if (this.isStringEnum(Enum)) {
            return Object.keys(Enum);
        }
        else {
            const count = Object.keys(Enum).length;
            return Object.values(Enum).slice(0, count / 2);
        }
    }
    static values(Enum) {
        if (this.isStringEnum(Enum)) {
            return Object.values(Enum);
        }
        else {
            const count = Object.keys(Enum).length;
            return Object.values(Enum).slice(count / 2);
        }
    }
    static isStringEnum(Enum) {
        return every(Object.entries(Enum), ([key, value]) => typeof key === 'string' && typeof value === 'string');
    }
}
