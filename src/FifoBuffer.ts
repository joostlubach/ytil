export class FifoBuffer<T> {

  constructor(
    private readonly capacity: number,
    private readonly array: T[] = [],
  ) {
  }

  public push(value: T) {
    this.array.push(value)
    if (this.array.length > this.capacity) {
      this.array.shift()
    }
  }

  public shift() {
    return this.array.shift()
  }

  public get length() {
    return this.array.length
  }

  public get(index: number) {
    return this.array[index]
  }

  public toArray() {
    return [...this.array]
  }


  
  
  
}