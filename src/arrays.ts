import { isArray, isEqual } from 'lodash'
import { isFunction } from './functions'

export function wrapArray<T>(arg: T | T[]): T[] {
  if (isArray(arg)) {
    return arg
  } else {
    return [arg]
  }
}

export function arrayEquals<T>(left: readonly T[] | null | undefined, right: readonly T[] | null | undefined, equals: (a: T, b: T) => boolean = isEqual): boolean {
  if (left == null) { return right == null }
  if (right == null) { return false }

  if (left.length !== right.length) { return false }

  for (let i = 0; i < left.length; i++) {
    if (!equals(left[i], right[i])) {
      return false
    }
  }

  return true
}

export function arrayMove<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  if (fromIndex === toIndex) { return array }
  if (fromIndex < 0 || fromIndex >= array.length) { return array }

  if (toIndex < 0) { toIndex = 0 }
  if (toIndex >= array.length) { toIndex = array.length - 1 }

  const newArray = [...array]
  const item = newArray.splice(fromIndex, 1)
  newArray.splice(toIndex, 0, ...item)

  return newArray
}

export function splitArray<T1, T2>(array: ReadonlyArray<T1 | T2>, predicate: (item: T1 | T2) => item is T1): [T1[], T2[]]
export function splitArray<T>(array: readonly T[], predicate: (item: T) => boolean): [T[], T[]]
export function splitArray<T>(array: readonly T[], predicate: (item: T) => boolean): [T[], T[]] {
  const matching: T[] = []
  const rest:     T[] = []

  for (const item of array) {
    if (predicate(item)) {
      matching.push(item)
    } else {
      rest.push(item)
    }
  }

  return [matching, rest]
}

export function sparse<T>(array: ReadonlyArray<T | false | null | undefined>): T[] {
  return array.filter(it => it === 0 || !!it) as T[]
}

export function sparseStrict<T>(array: ReadonlyArray<T | null | undefined>): T[] {
  return array.filter(it => it != null) as T[]
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
export function cartesian<T>(...arrays: T[][]): T[][] {
  const results: T[][] = []

  for (const array of arrays) {
    if (array.length === 0) { continue }

    if (results.length === 0) {
      for (const item of array) {
        results.push([item])
      }
    } else {
      const next: T[][] = []
      for (const result of results) {
        for (const item of array) {
          next.push([...result, item])
        }
      }
      results.splice(0, results.length, ...next)
    }
  }

  return results
}

export function collect<T>(iterable: Iterable<T> | ArrayLike<T>): T[] {
  return Array.from(iterable)
}

export async function collectAsync<T>(iterable: AsyncIterable<T>): Promise<T[]> {
  const result: T[] = []
  for await (const item of iterable) {
    result.push(item)
  }
  return result
}

export function trimOrPad<T>(array: readonly T[], length: number, padValue: T | ((index: number) => T)): T[] {
  if (array.length > length) {
    return array.slice(0, length)
  }
  
  const result = array.slice()
  while (result.length < length) {
    const value = isFunction(padValue) ? padValue(result.length) : padValue
    result.push(value)
  }
  return result
}