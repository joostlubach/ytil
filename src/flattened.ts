import { isArray } from 'lodash'

export function getFlattened<T>(target: T, path: string): any[] | any {
  const tree: any[] | any = target

  let current = tree
  for (const segment of path.split('.')) {
    if (segment.trim() === '') { continue }

    if (isArray(current)) {
      current = flatten(current.map(item => item[segment.trim()]))
    } else {
      current = current[segment.trim()]
    }
  }

  return current
}

export function setFlattened<T>(target: T, path: string, values: any | any[]) {
  const head = path.split('.')
  const tail = head.pop()!

  const targets = getFlattened(target, head.join('.'))
  if (isArray(values) && isArray(targets) && targets.length === values.length) {
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i]
      const value  = values[i]
      target[tail] = value
    }
  } else if (!isArray(targets)) {
    targets[tail] = values
  } else {
    // TODO: This should not happen - perhaps warning?
    targets[0][tail] = values
  }
}

function flatten(tree: any[]): any[] {
  const flatten = (tree: any[], result: any[]) => {
    for (const item of tree) {
      if (isArray(item)) {
        flatten(item, result)
      } else {
        result.push(item)
      }
    }
  }

  const result: any[] = []
  flatten(tree, result)
  return result
}