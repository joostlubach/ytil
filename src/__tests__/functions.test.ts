import { bindMethods } from '../functions'

describe('bindMethods', () => {

  it('binds the methods to the object', () => {
    class Counter {
      public count = 0
      public increment() { this.count += 1 }
    }

    const counter = new Counter()
    bindMethods(counter)

    const {increment} = counter
    increment()
    expect(counter.count).toBe(1)
  })

  it('binds an overriding method rather than the one it overrides', () => {
    class Base {
      public name() { return 'base' }
      public describe() { return `I am ${this.name()}` }
    }
    class Derived extends Base {
      public override name() { return 'derived' }
    }

    const derived = new Derived()
    bindMethods(derived)

    expect(derived.name()).toBe('derived')
    expect(derived.describe()).toBe('I am derived')
  })

})
