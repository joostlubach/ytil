import { isPlainObject as _isPlainObject } from 'lodash'

/**
 * This file contains some Lodash methods with slightly stricter typing.
 */

export const isPlainObject = _isPlainObject as (obj: any) => obj is Record<string, any>