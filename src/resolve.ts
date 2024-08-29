import { isFunction } from './functions'

export function resolve<T, A extends unknown[]>(value: T | ((...args: A) => T), ...args: A): T {
  return isFunction(value) ? value(...args) : value
}
