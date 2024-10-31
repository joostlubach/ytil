/**
 * Parses a float, but never returns `NaN`. Instead, it returns `undefined` if parsing failed.
 */
export function safeParseFloat(arg: unknown) {
  const number = typeof arg === 'number' ? arg : parseFloat(`${arg}`)
  return isNaN(number) ? undefined : number
}

/**
 * Parses an integer, but takes care of some pitfalls:
 * 
 * - The radix is always 10, unless otherwise specified. This is important because `parseInt` will
 *   interpret a leading `0` as an octal number, which is almost never what you want.
 * - The result is never `NaN` but will be `undefined` if the parsing failed.
 * 
 * @param arg The argument to parse.
 * @param radix An optional radius. Defaults to `10`, even if the argument starts with '0'.
 * @returns 
 */
export function safeParseInt(arg: unknown, radix: number = 10): number | undefined {
  const number = typeof arg === 'number' ? arg : parseInt(`${arg}`, radix)
  return isNaN(number) ? undefined : number
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