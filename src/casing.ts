import { snakeCase } from 'lodash'

const acronyms = ['id', 'url']

export function camelCaseKey(key: string | number | symbol) {
  if (typeof key === 'number') {
    return key
  }

  const re = /[^a-z0-9A-Z]+|[A-Z]/
  const keyString = String(key)

  let remaining = keyString
  let current = ''
  let result = ''
  let match = keyString.match(re)

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

    current = match[0].replace(/[^a-zA-Z0-9]/ig, '')
    remaining = remaining.slice(match.index! + match[0].length)
    match = remaining.match(re)
  }

  appendPart(current + remaining)
  if (typeof key === 'symbol') {
    return Symbol(result)
  } else {
    return result
  }
}

export function snakeCaseKey(key: string) {
  return snakeCase(key)
}
