export function isFunction<F extends (...args: any[]) => any>(fn: any): fn is F {
  return typeof fn === 'function'
}