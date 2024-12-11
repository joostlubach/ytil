export class Aggregate {
  
  constructor(
    public readonly data: number[] = [],
  ) {}

  private _sorted?: number[]
  private get sorted() {
    return this._sorted ??= [...this.data].sort((a, b) => a - b)
  }

  public push(value: number) {
    this.data.push(value)
  }

  public len() {
    return this.data.length
  }

  public sum() {
    return this.data.reduce((sum, value) => sum + value, 0)
  }

  public min() {
    if (this.data.length === 0) {
      throw new Error('Aggregate.min: data is empty')
    }
    return Math.min(...this.data)
  }

  public max() {
    if (this.data.length === 0) {
      throw new Error('Aggregate.max: data is empty')
    }
    return Math.max(...this.data)
  }

  public mean() {
    return this.sum() / this.data.length
  }

  public percentile(perc: number) {
    if (this.data.length === 0) {
      throw new Error('Aggregate.percentile: data is empty')
    }

    const findex = perc / 100 * (this.data.length - 1)
    const index = Math.floor(findex)
    const frac = findex - index
    if (frac === 0) {
      return this.sorted[index]
    } else {
      const lower = this.sorted[index]
      const upper = this.sorted[index + 1]
      return lower + frac * (upper - lower)
    }
  }

  public median() {
    return this.percentile(50)
  }

}