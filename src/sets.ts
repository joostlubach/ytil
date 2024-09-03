import { isEqual } from 'lodash'

export function diff<T>(arr1: ArrayLike<T>, arr2: ArrayLike<T>, equals: ((left: T, right: T) => boolean) = isEqual): T[] {
  return Array.from(arr1).filter(it1 => Array.from(arr2).some(it2 => equals(it1, it2)))
}

export function intersect<T>(arr1: ArrayLike<T>, arr2: ArrayLike<T>, equals: ((left: T, right: T) => boolean) = isEqual): T[] {
  return Array.from(arr1).filter(it1 => Array.from(arr2).some(it2 => equals(it1, it2)))
}