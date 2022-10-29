export function safeParseFloat(arg: any, defaultValue: number | null = null) {
  const number = parseFloat(arg)
  return isNaN(number) ? defaultValue : number
}

export function safeParseInt(arg: any, defaultValue: number | null = null, radix: number = 10) {
  const number = parseInt(arg, radix)
  return isNaN(number) ? defaultValue : number
}