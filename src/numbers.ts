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
