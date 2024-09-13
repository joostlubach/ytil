export function safeParseFloat(arg: unknown, defaultValue: number): number
export function safeParseFloat(arg: unknown, defaultValue?: null): number | null
export function safeParseFloat(arg: unknown, defaultValue: number | null = null) {
  const number = typeof arg === 'number' ? arg : parseFloat(`${arg}`)
  return isNaN(number) ? defaultValue : number
}

export function safeParseInt(arg: unknown, defaultValue: number, radix?: number): number
export function safeParseInt(arg: unknown, defaultValue?: null, radix?: number): number | null
export function safeParseInt(arg: unknown, defaultValue: number | null = null, radix: number = 10) {
  const number = typeof arg === 'number' ? arg : parseInt(`${arg}`, radix)
  return isNaN(number) ? defaultValue : number
}


/**
 * Like `clamp`, but cycles the value between `min` and `max` if it exceeds the bounds. If only one
 * bound argument is specified, the bounds are assumed to be `[0, arg]`.
 * 
 * ## Example
 * 
 * ```typescript
 * cycle(5, 0, 10) // => 5
 * cycle(15, 0, 10) // => 5
 * cycle(-5, 0, 10) // => 5
 * cycle(4, 10) // => 4
 * cycle(14, 10) // => 4
 * cycle(-6, 10) // => 4
 * cycle(9, 2, 6) // => 5
 * cycle(0, 2, 6) // => 4
 * cycle(-18, 2, 6) // => 4
 * ```
 */
export function cycle(value: number, max: number): number
export function cycle(value: number, min: number, max: number): number
export function cycle(value: number, ...bounds: [number] | [number, number]): number {
  let [min, max] = bounds.length === 1 ? [0, bounds[0]] : bounds
  if (min === max) { return min }
  if (min > max) { [min, max] = [max, min] }

  let result = value
  while (result < min) { result += max - min }
  while (result >= max) { result -= max - min }

  return result
}