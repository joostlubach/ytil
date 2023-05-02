import { isArray, isEqual } from 'lodash';
export function wrapArray(arg) {
    if (isArray(arg)) {
        return arg;
    }
    else {
        return [arg];
    }
}
export function arrayEquals(left, right, equals = isEqual) {
    if (left == null) {
        return right == null;
    }
    if (right == null) {
        return false;
    }
    if (left.length !== right.length) {
        return false;
    }
    for (let i = 0; i < left.length; i++) {
        if (!equals(left[i], right[i])) {
            return false;
        }
    }
    return true;
}
export function arrayMove(array, fromIndex, toIndex) {
    if (fromIndex === toIndex) {
        return array;
    }
    if (fromIndex < 0 || fromIndex >= array.length) {
        return array;
    }
    if (toIndex < 0) {
        toIndex = 0;
    }
    if (toIndex >= array.length) {
        toIndex = array.length - 1;
    }
    const newArray = [...array];
    const item = newArray.splice(fromIndex, 1);
    newArray.splice(toIndex, 0, ...item);
    return newArray;
}
export function splitArray(array, predicate) {
    const matching = [];
    const rest = [];
    for (const item of array) {
        if (predicate(item)) {
            matching.push(item);
        }
        else {
            rest.push(item);
        }
    }
    return [matching, rest];
}
export function sparse(array) {
    return array.filter(Boolean);
}
export function flatMap(input, fn) {
    const result = [];
    for (const value of input) {
        const out = fn(value);
        if (isArray(out)) {
            result.push(...out);
        }
        else {
            result.push(out);
        }
    }
    return result;
}
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
export function cartesian(...arrays) {
    const results = [];
    for (const array of arrays) {
        if (array.length === 0) {
            continue;
        }
        if (results.length === 0) {
            for (const item of array) {
                results.push([item]);
            }
        }
        else {
            const next = [];
            for (const result of results) {
                for (const item of array) {
                    next.push([...result, item]);
                }
            }
            results.splice(0, results.length, ...next);
        }
    }
    return results;
}
