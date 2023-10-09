export class NestedMap<Keys extends [any, ...any[]], Value> {

  private readonly _map = new Map<any, any>()
  public get map() { return this._map }

  public get(...keys: Keys): Value | undefined {
    const head = [...keys] as Keys
    const tail = head.pop()!

    const leaf = this.resolveLeaf(head, false)
    return leaf?.get(tail)
  }

  public set(...args: [...Keys, Value]): void {
    const head  = [...args] as any as Keys
    const value = head.pop()! as Value
    const tail  = head.pop()! as Keys[number]

    const leaf = this.resolveLeaf(head, true)
    leaf.set(tail, value)
  }

  public ensure(...args: [...Keys, () => Value]): Value {
    const head   = [...args] as any as Keys
    const defVal = args.pop()! as () => Value
    const tail   = head.pop()! as Keys[number]

    const leaf = this.resolveLeaf(head, true)

    let value = leaf.get(tail)
    if (value == null) {
      leaf.set(tail, value = defVal())
    }
    return value
  }

  public delete(...keys: Keys): void {
    const head = [...keys] as Keys
    const tail = head.pop()!

    const leaf = this.resolveLeaf(head, false)
    leaf?.delete(tail)

    this.cleanUp(head)
  }

  private resolveLeaf(keys: Keys, create: true): Map<any, any>
  private resolveLeaf(keys: Keys, create: false): Map<any, any> | undefined
  private resolveLeaf(keys: Keys, create: boolean) {
    let current = this._map
    for (const key of keys) {
      let next = current.get(key)
      if (next == null && !create) {
        return undefined
      }
      if (next == null) {
        current.set(key, next = new Map())
      }

      current = next
    }

    return current
  }

  private cleanUp(keys: Keys) {
    let current = this._map
    for (const key of keys) {
      const next = current.get(key)
      if (next == null) { break }
      if (next.size === 0) {
        // We found a map with size 0. Just remove it from here.
        current.delete(key)
      }

      current = next
    }
  }

}