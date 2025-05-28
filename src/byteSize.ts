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
 * Parses a byte size from a string or returns the number directly if it's already a number.
 * The string can be in the format of "1kB", "512MB", "2GB", etc.
 * 
 * @param size
 *   The size to parse. If a number is given, it's interpreted as bytes.
 * @param strict
 *   Whether to make a distinction between 1000-based (kB) and 1024-based sizes (kB).
 *   If true, it will interpret kB as 1000 bytes, MB as 1000^2 bytes, and GB as 1000^3 bytes.
 *   Specify kiB, MiB, GiB for 1024-based sizes. If false, it will interpret both kB and kiB
 *   as 1024 bytes.
 */
export function byteSize(size: number | string, strict: boolean = false) {
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
  case 'kb': return value * (strict ? 1000 : 1024)
  case 'mb': return value * (strict ? 1000 : 1024) ** 2
  case 'gb': return value * (strict ? 1000 : 1024) ** 3
  case 'kib': return value * 1024
  case 'mib': return value * 1024 ** 2
  case 'gib': return value * 1024 ** 3
  default: throw new Error(`Invalid byte size: ${size}`)
  }
}
