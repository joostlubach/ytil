import { objectKeys } from './lodashext'

export function isFunction<F extends(...args: any[]) => any>(value: any): value is F {
  return typeof value === 'function'
}

export function bindMethods<O extends object>(obj: O, options: BindMethodOptions = {}) {
  const isIncluded = (key: string | number | symbol) => {
    if (options.only && !filterContains(options.only, key)) { return false }
    if (options.except && filterContains(options.except, key)) { return false }
    return true
  }

  for (const key of objectKeys(obj)) {
    if (!isFunction(obj[key])) { continue }
    if (!isIncluded(key)) { continue }

    const prop = Object.getOwnPropertyDescriptor(obj, key)

    Object.defineProperty(obj, key, {
      ...prop,
      value: obj[key].bind(obj),
    })
  }
}

function filterContains(filter: string[] | RegExp, key: string | number | symbol) {
  const keyString = key.toString()
  if (filter instanceof RegExp) {
    return filter.test(keyString)
  } else {
    return filter.includes(keyString)
  }
}

export interface BindMethodOptions {
  only?:   string[] | RegExp
  except?: string[] | RegExp
}