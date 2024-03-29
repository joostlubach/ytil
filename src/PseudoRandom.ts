import { stringHash } from './text'

// Stolen & adapted from https://github.com/coverslide/node-alea.
// Which was adapted from a version by Johannes Baagøe <baagoe@baagoe.com>, 2010
export class PseudoRandom {

  constructor(
    seed: number = Date.now(),
  ) {
    const mash = Mash()
    this.s0 = clamp(mash(' ') - mash(seed))
    this.s1 = clamp(mash(' ') - mash(seed))
    this.s2 = clamp(mash(' ') - mash(seed))
  }

  public static from(seed: string) {
    return new PseudoRandom(stringHash(seed))
  }

  private c:  number = 1
  private s0: number
  private s1: number
  private s2: number

  public next() {
    const t = 2091639 * this.s0 + this.c * 2.3283064365386963e-10
    this.s0 = this.s1
    this.s1 = this.s2
    this.s2 = t - (this.c = t | 0)
    return this.s2
  }

  public uint(): number
  public uint(min: number, max: number): number
  public uint(min?: number, max?: number) {
    if (min == null || max == null) {
      return this.next() * 0x100000000
    } else {
      return Math.floor(min + this.next() * (max - min))
    }
  }

  public float(): number
  public float(min: number, max: number): number
  public float(min?: number, max?: number) {
    const val = this.next() + (this.next() * 0x200000 | 0) * 1.1102230246251565e-16
    if (min == null || max == null) {
      return val
    } else {
      return min + val * (max - min)
    }
  }

}

function clamp(x: number) {
  return x < 0 ? x + 1 : x
}

function Mash() {
  let n = 0xefc8249d

  return (data: unknown) => {
    const str = `${data}`
    for (let i = 0; i < str.length; i++) {
      n += str.charCodeAt(i)

      let h = 0.02519603282416938 * n
      n = h >>> 0
      h -= n
      h *= n
      n = h >>> 0
      h -= n
      n += h * 0x100000000 // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10 // 2^-32
  }
}
