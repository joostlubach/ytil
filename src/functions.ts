export function isFunction<F extends(...args: any[]) => any>(value: any): value is F {
  return typeof value === 'function'
}