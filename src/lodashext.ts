import { isPlainObject as _isPlainObject, keys as _keys } from 'lodash'

/**
 * This file contains some Lodash methods with slightly stricter typing.
 */

export const isPlainObject = _isPlainObject as (obj: any) => obj is Record<string, any>
export const objectKeys    = _keys as <T>(obj: T) => Array<keyof T>