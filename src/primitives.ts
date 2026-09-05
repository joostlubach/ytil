import { Primitive } from './types'

export function isPrimitive(val: unknown): val is Primitive {
  if (typeof val === 'string') { return true }
  if (typeof val === 'number') { return true }
  if (typeof val === 'boolean') { return true }

  return false
}