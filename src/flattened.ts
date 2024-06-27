import { isArray, isObject } from 'lodash'

export function getFlattened<T>(target: T, path: string): unknown[] | unknown {
  const tree: unknown[] | unknown = target

  let current = tree
  for (const segment of path.split('.')) {
    if (segment.trim() === '') { continue }

    if (isArray(current)) {
      current = flatten(current.map(item => item[segment.trim()]))
    } else if (isObject(current)) {
      current = (current as Record<string, unknown>)[segment.trim()]
    }
  }

  return current
}

export function setFlattened<T>(target: T, path: string, values: unknown | unknown[]) {
  const head = path.split('.')
  const tail = head.pop()!

  const targets = getFlattened(target, head.join('.'))
  if (isArray(values) && isArray(targets) && targets.length === values.length) {
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i]
      const value = values[i]
      target[tail] = value
    }
  } else if (isArray(targets)) {
    // TODO: This should not happen - perhaps warning?
    targets[0][tail] = values
  } else if (isObject(targets)) {
    (targets as Record<string, unknown>)[tail] = values
  }
}

function flatten(tree: unknown[]): unknown[] {
  const flatten = (tree: unknown[], result: unknown[]) => {
    for (const item of tree) {
      if (isArray(item)) {
        flatten(item, result)
      } else {
        result.push(item)
      }
    }
  }

  const result: unknown[] = []
  flatten(tree, result)
  return result
}
