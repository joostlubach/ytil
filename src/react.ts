export function isReactText(arg: any): arg is string | number {
  return typeof arg === 'string' || typeof arg === 'number'
}