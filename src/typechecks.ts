import { Primitive } from './types'

export function isPrimitive(val: unknown): val is Primitive {
  if (typeof val === 'string') { return true }
  if (typeof val === 'number') { return true }
  if (typeof val === 'boolean') { return true }

  return false
}

export function isBinary(val: unknown): boolean {
  if (val instanceof Uint8Array) { return true }
  if (val instanceof Uint16Array) { return true }
  if (val instanceof Uint32Array) { return true }
  if (val instanceof BigUint64Array) { return true }
  if ('Buffer' in globalThis && val instanceof (globalThis as any).Buffer) { return true }
  if ('Blob' in globalThis && val instanceof (globalThis as any).Blob) { return true }
  if ('ArrayBuffer' in globalThis && val instanceof (globalThis as any).ArrayBuffer) { return true }

  return false
}