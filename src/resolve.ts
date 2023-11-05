import { isFunction } from 'lodash'

export function resolve<T, A extends any[]>(value: T | ((...args: A) => T), ...args: A): T {
  return isFunction(value) ? value(...args) : value
}