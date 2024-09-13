import { isEqual } from 'lodash'

export function diff<T>(lists: ArrayLike<T>[], options: SetOperationOptions<T> = {}): T[] {
  const {equals = isEqual} = options
  const arrays = lists.map(it => Array.from(it))
  return arrays[0].filter(it1 => !arrays.slice(1).some(arr => arr.some(it2 => equals(it1, it2))))
}

export function intersect<T>(lists: ArrayLike<T>[], options: SetOperationOptions<T> = {}): T[] {
  const {equals = isEqual} = options
  const arrays = lists.map(it => Array.from(it))
  return arrays[0].filter(it1 => arrays.slice(1).every(arr => arr.some(it2 => equals(it1, it2))))
}

export function union<T>(lists: ArrayLike<T>[], options: SetOperationOptions<T> = {}): T[] {
  const {equals = isEqual} = options

  const result: T[] = []
  for (const list of lists) {
    for (const value of Array.from(list)) {
      if (!result.some(it => equals(it, value))) {
        result.push(value)
      }
    }
  }

  return result
}

export interface SetOperationOptions<T> {
  equals?: (left: T, right: T) => boolean
}