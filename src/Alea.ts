// Stolen & adapted from https://github.com/coverslide/node-alea.
// Which was adapted from a version by Johannes Baagøe <baagoe@baagoe.com>, 2010
export class PseudoRandom {

  constructor(
    seed: number = Date.now()
  ) {
    const mash = Mash();
    this.s0 = clamp(mash(' ') - mash(seed));
    this.s1 = clamp(mash(' ') - mash(seed));
    this.s2 = clamp(mash(' ') - mash(seed));
  }

  private c: number = 1
  private s0: number
  private s1: number
  private s2: number

  public next() {
    const t = 2091639 * this.s0 + this.c * 2.3283064365386963e-10;
    this.s0 = this.s1
    this.s1 = this.s2
    this.s2 = t - (this.c = t | 0)
    return this.s2
  }

  public nextUint32() {
    return this.next() * 0x100000000; // 2^32
  }

  public fract53() {
    return this.next() + (this.next() * 0x200000 | 0) * 1.1102230246251565e-16;
  }

}

function clamp(x: number) {
  return x < 0 ? x + 1 : x
}

function Mash() {
  let n = 0xefc8249d;

  return (data: any) => {
    const str = data.toString()
    for (let i = 0; i < str.length; i++) {
      n += str.charCodeAt(i);

      let h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  }
}