import {
  entries as _entries,
  isObject as _isObject,
  isPlainObject as _isPlainObject,
  keys as _keys,
  values as _values,
} from 'lodash'
import { UnknownObject } from './types'

/**
 * This file contains some Lodash methods with slightly stricter typing.
 */

export const isPlainObject = _isPlainObject as <T extends UnknownObject>(obj: unknown) => obj is T
export const isObject = _isObject as <T extends object>(obj: unknown) => obj is T
export const objectKeys = _keys as <T>(obj: T) => Array<keyof T>
export const objectValues = _values as <T>(obj: T) => Array<T[keyof T]>
export const objectEntries = _entries as <T>(obj: T) => Array<[keyof T, T[keyof T]]>
