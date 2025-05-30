// Port of the `ms` package, but then that it deterministically returns a number.

export function ms(input: string | number): number {
  if (typeof input === 'number') { return input }

  const match = REGEXP.exec(input.trim())
  if (match == null) {
    throw new Error(`Invalid time format: ${input}`);
  }

  const multiplier = match[2] ? units[match[2] as keyof typeof units] : 1
  return parseFloat(match[1]) * multiplier;
}

const units = {
  s: 1000,
  m: 1000 * 60,
  h: 1000 * 60 * 60,
  d: 1000 * 60 * 60 * 24,
  w: 1000 * 60 * 60 * 24 * 7,
}

const REGEXP = /^(-?(?:\d+)?\.?\d+)\s*(s|m|h|d|w)?$/i