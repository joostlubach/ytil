// Port of the `ms` package, but then that it deterministically returns a number.

export function ms(input: MsInput): number {
  if (typeof input === 'number') { return input }

  const match = MS_INPUT_REGEXP.exec(input.trim())
  if (match == null) {
    throw new Error(`Invalid time format: ${input}`)
  }

  const multiplier = match[2] ? units[match[2] as keyof typeof units] : 1
  return parseFloat(match[1]) * multiplier
}

const units = {
  ms: 1,
  s:  1000,
  m:  1000 * 60,
  h:  1000 * 60 * 60,
  d:  1000 * 60 * 60 * 24,
  w:  1000 * 60 * 60 * 24 * 7,
}

export const MS_INPUT_REGEXP = /^(-?(?:\d+)?\.?\d+)\s*(ms|s|m|h|d|w)?$/i

export type MsInput = `${number}${keyof typeof units}` | number