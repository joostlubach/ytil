import { isArray, isEqual, mapKeys, mapValues, omitBy } from 'lodash'
import { isObject, isPlainObject, objectEntries, objectKeys } from './lodashext'
import { ObjectKey, UnknownObject } from './types'

export function emptyObject() {
  return {}
}

export function hasKeys<O extends object>(obj: object, keys: Array<keyof O>): obj is O {
  return keys.every(key => key in obj)
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

export function omitUndefined(input: object) {
  return omitBy(input, value => value === undefined) as any
}

// ------
// misc

export function rename<O extends object, K1 extends keyof O, K2 extends ObjectKey>(obj: O, prevKey: K1, nextKey: K2): Omit<O, K1> & {[key in K2]: O[K1]} {
  const {[prevKey]: value, ...rest} = obj
  return {...rest, [nextKey]: value} as Omit<O, K1> & {[key in K2]: O[K1]}
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

export function deepMapKeys<O extends object>(arg: O, fn: (value: unknown, keyPath: ObjectKey[]) => ObjectKey): O {
  const iter = (value: unknown, prefix: ObjectKey[]): unknown => {
    const result = fn(value, prefix)
    if (result !== undefined) { return result }

    if (isObject(value)) {
      return deepMapKeys(value, (value, keyPath) => fn(value, [...prefix, ...keyPath]))
    } else if (isArray(value)) {
      return value.map((it, index) => iter(it, [...prefix, index]))
    } else {
      return value
    }
  }

  return mapKeys(arg, (value, key) => iter(value, [key])) as O
}

export function deepMapValues<O extends object>(arg: O, fn: (value: unknown, keyPath: ObjectKey[]) => unknown): O {
  const iter = (value: unknown, prefix: ObjectKey[]): unknown => {
    const result = fn(value, prefix)
    if (result !== undefined) { return result }

    if (isObject(value)) {
      return deepMapValues(value, (value, keyPath) => fn(value, [...prefix, ...keyPath]))
    } else if (isArray(value)) {
      return value.map((it, index) => iter(it, [...prefix, index]))
    } else {
      return value
    }
  }

  return mapValues(arg, (value, key) => iter(value, [key])) as O
}

export async function deepMapKeysAsync<O extends object>(arg: O, fn: (value: unknown, keyPath: ObjectKey[]) => ObjectKey): Promise<O> {
  const iter = async (value: unknown, prefix: ObjectKey[]): Promise<unknown> => {
    const result = fn(value, prefix)
    if (result !== undefined) { return result }

    if (isObject(value)) {
      return await deepMapKeysAsync(value, (value, keyPath) => fn(value, [...prefix, ...keyPath]))
    } else if (isArray(value)) {
      return await Promise.all(value.map((it, index) => iter(it, [...prefix, index])))
    } else {
      return value
    }
  }

  const promises = objectEntries(arg).map(async ([key, value]) => {
    const newKey = await iter(value, [key])
    return [newKey, value] as [ObjectKey, unknown]
  })
  const entries = await Promise.all(promises)
  return Object.fromEntries(entries) as O
}

export async function deepMapValuesAsync<O extends object>(arg: O, fn: (value: unknown, keyPath: ObjectKey[]) => unknown): Promise<O> {
  const iter = async (value: unknown, prefix: ObjectKey[]): Promise<unknown> => {
    const result = fn(value, prefix)
    if (result !== undefined) { return result }

    if (isObject(value)) {
      return await deepMapValuesAsync(value, (value, keyPath) => fn(value, [...prefix, ...keyPath]))
    } else if (isArray(value)) {
      return await Promise.all(value.map((it, index) => iter(it, [...prefix, index])))
    } else {
      return value
    }
  }

  const promises = objectEntries(arg).map(async ([key, value]) => {
    const newValue = await iter(value, [key])
    return [key, newValue] as [ObjectKey, unknown]
  })
  const entries = await Promise.all(promises)
  return Object.fromEntries(entries) as O
}
