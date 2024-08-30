import { isArray } from 'lodash'

export namespace monad {

  export function wrap<T>(value: T | T[]): T[] {
    if (isArray(value)) {
      return value
    } else {
      return [value]
    }
  }

  export function map<T, U>(value: T, map: (value: T) => U): U
  export function map<T, U>(value: T[], map: (value: T) => U): U[]
  export function map<T, U>(value: T | T[], map: (value: T) => U): U | U[]
  export function map<T, U>(value: T | T[], map: (value: T) => U): U | U[] {
    if (isArray(value)) {
      return value.map(map)
    } else {
      return map(value)
    }
  }

}
