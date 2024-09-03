import { isArray, isEqual, omitBy } from 'lodash'
import { isObject, isPlainObject, objectEntries, objectKeys } from './lodashext'
import { ObjectKey, UnknownObject } from './types'

export function emptyObject() {
  return {}
}

export function omitUndefined<O extends object>(obj: O): OmitUndefined<O> {
  return omitBy(obj, value => value === undefined) as unknown as OmitUndefined<O>
}

export type OmitUndefined<O extends object> = {
  [K in keyof O as O[K] extends undefined ? never : K]: O[K]
}

// ------
// objectEquals

export function objectEquals<O extends object>(left: O | null | undefined, right: O | null | undefined, equals: (a: unknown, b: unknown) => boolean = isEqual): boolean {
  if (left == null) { return right == null }
  if (right == null) { return false }

  if (Object.keys(left).length !== Object.keys(right).length) { return false }

  for (const key of objectKeys(left)) {
    if (!equals(left[key], right[key])) {
      return false
    }
  }

  return true
}

// ------
// modifyObject

export function modifyObject<T extends object>(root: T, path: string, modifier: (value: unknown) => unknown): T
export function modifyObject<T extends object>(root: T[], path: string, modifier: (value: unknown) => unknown): T[]
export function modifyObject<T extends object>(root: T | T[], path: string, modifier: (value: unknown) => unknown): T | T[]
export function modifyObject(root: UnknownObject | UnknownObject[], path: string, modifier: (value: unknown) => unknown) {
  const segments = path.split('.').filter(Boolean)
  return modify(root, segments, modifier)
}

function modify<O>(obj: O, segments: ObjectKey[], modifier: <T>(value: T) => unknown): object {
  const modify = (obj: unknown, segments: ObjectKey[], modifier: <T>(value: T) => unknown): unknown => {
    if (segments.length === 0) {
      // We've arrived at the leaf, just run the modifier.
      return modifier(obj)
    }

    // If we've arrived at an array, map over it instead of continuing.
    if (isArray(obj)) {
      // Create a shallow copy of the segments array to prevent double pop.
      return obj.map(item => modify(item, [...segments], modifier))
    }

    // If we've arrived at some other value than an object, but we're not done, the value cannot be found nor modified.
    // Just return the original object.
    if (!isPlainObject(obj)) {
      return obj
    }

    const prop = segments.shift()!
    if (isObject(obj) && prop in obj) {
      // Take the next path segment from the list and replace it.
      return {...obj, [prop]: modify((obj as UnknownObject)[prop], segments, modifier)}
    } else {
      // The property did not exist. Just return the object (instead of inserting an explicit `undefined`).
      return obj
    }
  }

  return modify(obj, segments, modifier) as object
}

// ------
// modifyInObject

export function modifyInObject<R>(root: R, path: string, modify: ModifyInObjectCallback<R>): boolean {
  const segments = path.split('.')
  const leaf = segments.pop()!

  let current: unknown = root
  while (current != null && segments.length > 0) {
    const segment = segments.shift()!
    if (isArray(current)) {
      current = current[keyToIndex(segment)]
    } else if (isObject(current)) {
      current = (current as UnknownObject)[segment]
    } else {
      current = null
    }
  }
  if (current == null) { return false }

  // If we've arrived at an array, map over it instead of continuing, unless the path explicitly
  // wants to target a specific index.
  const hasIndex = /^\d+$/.test(leaf)

  if (isArray(current) && !hasIndex) {
    for (const item of current) {
      const retval = modify(item[leaf], item, leaf, root)
      if (retval === false) { return false }
    }
    return true
  } else if (isArray(current)) {
    const index = parseInt(leaf, 10)
    return modify(current[index], current, index, root) ?? true
  } else if (isObject(current)) {
    return modify((current as UnknownObject)[leaf], current, leaf, root) ?? true
  } else {
    return false
  }
}

function keyToIndex(key: string) {
  const index = parseInt(key, 10)
  if (isNaN(index)) {
    throw new Error('Cannot descend into array with a string key')
  }
  return index
}

export type ModifyInObjectCallback<R> = <T>(
  value: T,
  parent: unknown,
  key: string | number,
  root: R
) => void | boolean

// ------
// deepMap*

export function deepMapKeys<O>(arg: O, fn: (key: ObjectKey) => ObjectKey): object {
  const visit = (arg: unknown): unknown => {
    if (isArray(arg)) {
      return arg.map(it => deepMapKeys(it, fn))
    } else if (isObject(arg)) {
      const result: UnknownObject = {}
      for (const [attribute, value] of objectEntries(arg)) {
        if (!isObject(value)) { continue }
        result[fn(attribute)] = deepMapKeys(value, fn)
      }
      return result
    } else {
      return arg
    }
  }

  return visit(arg) as object
}

export function deepMapValues(arg: unknown, fn: (value: unknown) => unknown): unknown {
  if (isPlainObject(arg)) {
    const result: UnknownObject = {}
    for (const [attribute, value] of objectEntries(arg)) {
      result[attribute] = deepMapValues(value, fn)
    }
    return result
  } else if (isArray(arg)) {
    return arg.map(it => deepMapValues(it, fn))
  } else {
    return fn(arg)
  }
}

export async function deepMapKeysAsync<O>(arg: O, fn: (key: ObjectKey) => Promise<ObjectKey>): Promise<object> {
  const visit = async (arg: unknown): Promise<unknown> => {
    if (isArray(arg)) {
      return await Promise.all(arg.map(it => deepMapKeysAsync(it, fn)))
    } else if (isObject(arg)) {
      const result: UnknownObject = {}
      for (const [attribute, value] of objectEntries(arg)) {
        if (!isObject(value)) { continue }
        result[await fn(attribute)] = deepMapKeysAsync(value, fn)
      }
      return result
    } else {
      return arg
    }
  }

  return visit(arg) as object
}

export async function deepMapValuesAsync(arg: unknown, fn: (value: unknown) => Promise<unknown>): Promise<unknown> {
  if (isPlainObject(arg)) {
    const result: UnknownObject = {}
    for (const [attribute, value] of objectEntries(arg)) {
      result[attribute] = await deepMapValuesAsync(value, fn)
    }
    return result
  } else if (isArray(arg)) {
    return await Promise.all(arg.map(it => deepMapValuesAsync(it, fn)))
  } else {
    return await fn(arg)
  }
}
