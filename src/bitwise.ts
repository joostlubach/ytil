/* eslint-disable no-bitwise */

export function hasBitmask<N extends number>(value: N, mask: number): boolean {
  return (value & mask) === value
}