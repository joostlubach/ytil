import { describe, expect, it } from 'bun:test'
import { NestedMap } from '../NestedMap'

describe('NestedMap', () => {

  it('should allow creating a NestedMap', () => {
    const map = new NestedMap()
    expect(map).toBeInstanceOf(NestedMap)
  })

  it('should allow using multiple keys to read from and write to the map', () => {
    const map = new NestedMap<[string, number], string>()

    map.set('foo', 1, 'bar')
    map.set('foo', 2, 'baz')
    map.set('bar', 1, 'foo')
    map.set('baz', 2, 'foo')

    expect(map.get('foo', 1)).toEqual('bar')
    expect(map.get('foo', 2)).toEqual('baz')
    expect(map.get('bar', 1)).toEqual('foo')
    expect(map.get('baz', 2)).toEqual('foo')

    expect(map.get('foo', 3)).toBeUndefined()
    expect(map.get('bar', 3)).toBeUndefined()
    expect(map.get('baz', 3)).toBeUndefined()

    expect(map.get('unknown', 1)).toBeUndefined()
    expect(map.get('unknown', 3)).toBeUndefined()
  })

  it('should have an ensure function that gets an item and adds it if not found', () => {
    const map = new NestedMap<[string, number], string>()
    map.set('foo', 1, 'bar')

    map.ensure('foo', 1, () => 'baz')
    map.ensure('foo', 2, () => 'baz')

    expect(map.get('foo', 1)).toEqual('bar')
    expect(map.get('foo', 2)).toEqual('baz')
  })

  it('should allow deleting items', () => {
    const map = new NestedMap<[string, number], string>()

    map.set('foo', 1, 'bar')
    map.set('foo', 2, 'baz')
    map.set('bar', 1, 'foo')

    map.delete('foo', 2)
    map.delete('bar', 1)

    expect(map.get('foo', 1)).toEqual('bar')
    expect(map.get('foo', 2)).toBeUndefined()
    expect(map.get('bar', 1)).toBeUndefined()
  })

  it('should for good measure remove unknown empty nested maps', () => {
    const map = new NestedMap<[string, number], string>()

    map.set('foo', 1, 'bar')
    map.set('foo', 2, 'baz')
    map.set('bar', 1, 'foo')

    expect(map.map).toEqual(new Map([
      [
        'foo',
        new Map([
          [1, 'bar'],
          [2, 'baz'],
        ]),
      ],
      [
        'bar',
        new Map([
          [1, 'foo'],
        ]),
      ],
    ]))

    map.delete('foo', 2)
    map.delete('bar', 1)

    expect(map.map).toEqual(new Map([
      [
        'foo',
        new Map([
          [1, 'bar'],
        ]),
      ],
    ]))

    map.delete('foo', 1)
    expect(map.map).toEqual(new Map())
  })
  
})
