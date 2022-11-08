import { isArray, isPlainObject, snakeCase } from 'lodash'

const acronyms = ['id', 'url']

export function camelCaseKey(key: string) {
  const re = /[^a-z0-9A-Z]+|[A-Z]/

  let remaining = key
  let current   = ''
  let result    = ''
  let match     = key.match(re)

  const appendPart = (part: string) => {
    if (remaining === key) {
      result += part.toLowerCase()
    } else if (acronyms.includes(part)) {
      result += part.toUpperCase()
    } else {
      result += part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    }
  }

  while (match != null) {
    current += remaining.slice(0, match.index!).toLowerCase()
    appendPart(current)

    current   = match[0].replace(/[^a-zA-Z0-9]/ig, '')
    remaining = remaining.slice(match.index! + match[0].length)
    match     = remaining.match(re)
  }

  appendPart(current + remaining)
  return result
}

export function snakeCaseKey(key: string) {
  return snakeCase(key)
}

export function camelCaseKeys<T extends Record<string, any>>(obj: T): T {
  if (isPlainObject(obj)) {
    return Object.entries(obj).reduce((res, [key, value]) => ({
      ...res,
      [camelCaseKey(key)]: camelCaseKeys(value),
    }), {}) as T
  } else if (isArray(obj)) {
    return obj.map(camelCaseKeys) as any as T
  } else {
    return obj
  }
}

export function snakeCaseKeys<T extends Record<string, any>>(obj: T): T {
  if (isPlainObject(obj)) {
    return Object.entries(obj).reduce((res, [key, value]) => ({
      ...res,
      [snakeCaseKey(key)]: snakeCaseKeys(value),
    }), {}) as T
  } else if (isArray(obj)) {
    return obj.map(camelCaseKeys) as any as T
  } else {
    return obj
  }
}