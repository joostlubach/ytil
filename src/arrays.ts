import { isArray, isEqual } from 'lodash'

export function wrapArray<T>(arg: T | T[]): T[] {
  if (isArray(arg)) {
    return arg
  } else {
    return [arg]
  }
}

export function arrayEquals<T>(left: T[] | null | undefined, right: T[] | null | undefined, equals: (a: T, b: T) => boolean = isEqual): boolean {
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

export function splitArray<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
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

export function sparse<T>(array: Array<T | false | null | 0 | undefined>): T[] {
  return array.filter(Boolean) as T[]
}

export function flatMap<T, U>(input: T[], fn: (value: T) => U | U[]): U[] {
  const result: U[] = []
  for (const value of input) {
    const out = fn(value)
    if (isArray(out)) {
      result.push(...out)
    } else {
      result.push(out)
    }
  }
  return result
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