export class NestedWeakMap<Keys extends [unknown, ...unknown[]], Value> {

  private readonly _map = new WeakMap<any, unknown>()
  public get map() { return this._map }

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
  }

  private resolveLeaf(keys: Keys, create: true): Map<unknown, unknown>
  private resolveLeaf(keys: Keys, create: false): Map<unknown, unknown> | undefined
  private resolveLeaf(keys: Keys, create: boolean) {
    let current = this._map
    for (const key of keys) {
      let next = current.get(key) as WeakMap<object, unknown>
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

}
