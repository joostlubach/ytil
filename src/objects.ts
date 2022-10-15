import { isArray, isEqual, isPlainObject } from 'lodash'

export function objectEquals(left: AnyObject | null | undefined, right: AnyObject | null | undefined, equals: (a: any, b: any) => boolean = isEqual): boolean {
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

export function modifyInObject<T extends AnyObject>(root: T, path: string, modifier: (value: any) => any): T
export function modifyInObject<T extends AnyObject>(root: T[], path: string, modifier: (value: any) => any): T[]
export function modifyInObject<T extends AnyObject>(root: T | T[], path: string, modifier: (value: any) => any): T | T[]
export function modifyInObject(root: AnyObject | AnyObject[], path: string, modifier: (value: any) => any) {
  const segments = path.split('.').filter(Boolean)
  return modify(root, segments, modifier)
}

function modify(obj: any, segments: string[], modifier: (value: any) => any): any {
  if (segments.length === 0) {
    // We've arrived at the leaf, just run the modifier.
    return isArray(obj) ? obj.map(modifier) : modifier(obj)
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
    return {...obj, [prop]: modify(obj[prop], segments, modifier)}
  } else {
    // The property did not exist. Just return the object (instead of inserting an explicit `undefined`).
    return obj
  }
}