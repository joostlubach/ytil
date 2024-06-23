export function formatByteSize(size: number) {
  if (size > 1024 ** 3) {
    return `${(size / (1024 ** 3)).toFixed(1)}GB`
  } else if (size > 1024 ** 2) {
    return `${(size / (1024 ** 2)).toFixed(1)}MB`
  } else if (size > 1024) {
    return `${(size / 1024).toFixed(1)}kB`
  } else {
    return `${size}B`
  }
}

/**
 *
 * @param size The size to parse. If a number is given, it's interpreted as bytes.
 */
export function byteSize(size: number | string) {
  if (typeof size === 'number') {
    return size
  }

  const match = size.match(/^(\d+(?:\.\d+)?)\s*(\w+)$/)
  if (match == null) {
    throw new Error(`Invalid byte size: ${size}`)
  }

  const value = parseFloat(match[1])
  const unit = match[2].toLowerCase()

  switch (unit) {
  case 'b': return value
  case 'kb': return value * 1024
  case 'mb': return value * 1024 ** 2
  case 'gb': return value * 1024 ** 3
  default: throw new Error(`Invalid byte size: ${size}`)
  }
}
