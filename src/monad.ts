import { isArray } from 'lodash'

export namespace monad {

  export function map<T, U>(value: null, map: (value: T) => U): null
  export function map<T, U>(value: T[], map: (value: T) => U): U[]
  export function map<T, U>(value: T, map: (value: T) => U): U | U[]
  export function map<T, U>(value: T | T[] | null, map: (value: T) => U): U | U[] | null
  export function map<T, U>(value: T | T[], map: (value: T) => U): U | U[] | null{
    if (isArray(value)) {
      return value.map(map)
    } else if (value != null) {
      return map(value)
    } else {
      return null
    }
  }

}
