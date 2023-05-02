export declare function wrapArray<T>(arg: T | T[]): T[];
export declare function arrayEquals<T>(left: T[] | null | undefined, right: T[] | null | undefined, equals?: (a: T, b: T) => boolean): boolean;
export declare function arrayMove<T>(array: T[], fromIndex: number, toIndex: number): T[];
export declare function splitArray<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]];
export declare function sparse<T>(array: Array<T | false | null | 0 | undefined>): T[];
export declare function flatMap<T, U>(input: T[], fn: (value: T) => U | U[]): U[];
/**
 * Given M arrays with N items, returns a new array which contains all combinations of the
 * input array.
 *
 * Examples:
 *   - `cartesian([1, 2], ['A', 'B']) => [[1, 'A'], [1, 'B'], [2, 'A'], [2, 'B']]`
 *   - `cartesian([1, 2], [3, 4])     => [[1, 3], [1, 4], [2, 3], [2, 4]]`
 *
 * @param arrays The input arrays.
 * @returns The cartesian product of all arrays.
 */
export declare function cartesian<T>(...arrays: T[][]): T[][];
