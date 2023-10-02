import { isArray, isEqual, isFunction, isObject, isPlainObject } from 'lodash'

//------
// objectEquals

export function objectEquals(left: Record<string, any> | null | undefined, right: Record<string, any> | null | undefined, equals: (a: any, b: any) => boolean = isEqual): boolean {
  if (left == null) { return right == null }
  if (right == null) { return false }

  if (Object.keys(left).length !== Object.keys(right).length) { return false }

  for (const key of Object.keys(left)) {
    if (!equals(left[key], right[key])) {
      return false
    }
  }

  return true
}

//------
// modifyObject

export function modifyObject<T extends Record<string, any>>(root: T, path: string, modifier: (value: any) => any): T
export function modifyObject<T extends Record<string, any>>(root: T[], path: string, modifier: (value: any) => any): T[]
export function modifyObject<T extends Record<string, any>>(root: T | T[], path: string, modifier: (value: any) => any): T | T[]
export function modifyObject(root: Record<string, any> | Record<string, any>[], path: string, modifier: (value: any) => any) {
  const segments = path.split('.').filter(Boolean)
  return modify(root, segments, modifier)
}

function modify(obj: any, segments: string[], modifier: (value: any) => any): any {
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
  if (prop in obj) {
    // Take the next path segment from the list and replace it.
    return { ...obj, [prop]: modify(obj[prop], segments, modifier) }
  } else {
    // The property did not exist. Just return the object (instead of inserting an explicit `undefined`).
    return obj
  }
}

//------
// modifyInObject

export function modifyInObject<R extends Record<string, any>>(root: R, path: string, modify: ModifyInObjectCallback<R>) {
  const segments = path.split('.')
  const leaf = segments.pop()!

  let current: any = root
  while (current != null && segments.length > 0) {
    const segment = segments.shift()!
    if (isArray(current)) {
      current = current[keyToIndex(segment)]
    } else if (isObject(current)) {
      current = (current as any)[segment]
    } else {
      current = null
    }
  }
  if (current == null) { return false }

  // If we've arrived at an array, map over it instead of continuing, unless the path explicitly
  // wants to target a specific index.
  const hasIndex = /^\d+$/.test(leaf)
  const currentIsArray = isArray(current)

  if (currentIsArray && !hasIndex) {
    for (const item of current) {
      const retval = modify(item[leaf], item, leaf, root)
      if (retval === false) { return false }
    }
    return true
  } else if (hasIndex) {
    const index = parseInt(leaf, 10)
    return modify(current[index], current, index, root) ?? true
  } else {
    return modify(current[leaf], current, leaf, root) ?? true
  }
}

function keyToIndex(key: string) {
  const index = parseInt(key, 10)
  if (isNaN(index)) {
    throw new Error("Cannot descend into array with a string key")
  }
  return index
}

export type ModifyInObjectCallback<R extends Record<string, any>> = <T>(
  value: T,
  parent: any,
  key: string | number,
  root: R
) => void | boolean

//------
// deepMap*

export function deepMapKeys(arg: any, fn: (key: string | symbol) => any): any {
  if (isPlainObject(arg)) {
    const result: Record<string, any> = {}
    for (const [attribute, value] of Object.entries(arg)) {
      result[fn(attribute)] = deepMapKeys(value, fn)
    }
    return result
  } else if (isArray(arg)) {
    return arg.map(it => deepMapKeys(it, fn))
  } else {
    return arg
  }
}

export function deepMapValues(arg: any, fn: (value: any) => any): any {
  if (isPlainObject(arg)) {
    const result: Record<string, any> = {}
    for (const [attribute, value] of Object.entries(arg)) {
      result[attribute] = deepMapValues(value, fn)
    }
    return result
  } else if (isArray(arg)) {
    return arg.map(it => deepMapValues(it, fn))
  } else {
    return fn(arg)
  }
}

//------
// Methods

export function bindMethods(obj: object) {
  let current = obj

  while (current != null && current !== Object) {
    for (const name of Object.getOwnPropertyNames(current)) {
      const value = (current as any)[name]
      if (!isFunction(value)) { continue }

      Object.assign(obj, {
        [name]: value.bind(obj)
      })
    }

    current = Object.getPrototypeOf(current)
  }
}