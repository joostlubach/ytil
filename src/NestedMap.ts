export class NestedMap<Keys extends [unknown, ...unknown[]], Value> {

  private readonly _map = new Map<unknown, unknown>()
  public get map() { return this._map }

  public has(...keys: Keys): boolean {
    const head = [...keys] as Keys
    const tail = head.pop()!

    const leaf = this.resolveLeaf(head, false)
    return leaf?.has(tail) ?? false
  }

  public get(...keys: Keys): Value | undefined {
    const head = [...keys] as Keys
    const tail = head.pop()!

    const leaf = this.resolveLeaf(head, false)
    return leaf?.get(tail) as Value | undefined
  }

  public set(...args: [...Keys, Value]): void {
    const head = [...args] as unknown as Keys
    const value = head.pop()! as Value
    const tail = head.pop()! as Keys[number]

    const leaf = this.resolveLeaf(head, true)
    leaf.set(tail, value)
  }

  public ensure(...args: [...Keys, () => Value]): Value {
    const head = [...args] as unknown as Keys
    const defVal = head.pop()! as () => Value
    const tail = head.pop()! as Keys[number]

    const leaf = this.resolveLeaf(head, true)

    let value = leaf.get(tail) as Value | undefined
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

  public clear() {
    this.map.clear()
  }

  private resolveLeaf(keys: Keys, create: true): Map<unknown, unknown>
  private resolveLeaf(keys: Keys, create: false): Map<unknown, unknown> | undefined
  private resolveLeaf(keys: Keys, create: boolean) {
    let current = this._map
    for (const key of keys) {
      let next = current.get(key) as Map<unknown, unknown>
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
      if (!(next instanceof Map)) { break }
      if (next.size === 0) {
        // We found a map with size 0. Just remove it from here.
        current.delete(key)
      }

      current = next
    }
  }

}
