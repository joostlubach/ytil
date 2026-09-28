import { expectTypeOf } from 'vitest'
import { EnumName, EnumUtil, EnumValue } from '../EnumUtil'

describe('EnumUtil', () => {

  describe('string enums', () => {

    it('should list names and values', () => {
      expect(EnumUtil.names(StringEnum)).toEqual(['A', 'B'])
      expect(EnumUtil.values(StringEnum)).toEqual(['a', 'b'])
      expect(EnumUtil.isStringEnum(StringEnum)).toBe(true)
    })

    it('should ignore namespace augmentations', () => {
      expect(EnumUtil.names(AugmentedStringEnum)).toEqual(['A', 'B'])
      expect(EnumUtil.values(AugmentedStringEnum)).toEqual(['a', 'b'])
      expect(EnumUtil.isStringEnum(AugmentedStringEnum)).toBe(true)
      expect(EnumUtil.is(AugmentedStringEnum, 'a')).toBe(true)
      expect(EnumUtil.is(AugmentedStringEnum, 'describe')).toBe(false)
    })

    it('should type names and values without augmentations', () => {
      expectTypeOf<EnumValue<typeof AugmentedStringEnum>>().toEqualTypeOf<AugmentedStringEnum>()
      expectTypeOf<EnumName<typeof AugmentedStringEnum>>().toEqualTypeOf<'A' | 'B'>()
    })

  })

  describe('number enums', () => {

    it('should list names and values', () => {
      expect(EnumUtil.names(NumberEnum)).toEqual(['A', 'B'])
      expect(EnumUtil.values(NumberEnum)).toEqual([1, 2])
      expect(EnumUtil.isStringEnum(NumberEnum)).toBe(false)
    })

    it('should ignore namespace augmentations', () => {
      expect(EnumUtil.names(AugmentedNumberEnum)).toEqual(['A', 'B'])
      expect(EnumUtil.values(AugmentedNumberEnum)).toEqual([1, 2])
      expect(EnumUtil.isStringEnum(AugmentedNumberEnum)).toBe(false)
    })

    it('should type values without augmentations', () => {
      expectTypeOf<EnumValue<typeof AugmentedNumberEnum>>().toEqualTypeOf<AugmentedNumberEnum>()
    })

  })

})

enum StringEnum {
  A = 'a',
  B = 'b',
}

enum AugmentedStringEnum {
  A = 'a',
  B = 'b',
}

namespace AugmentedStringEnum {
  export function describe(value: AugmentedStringEnum) {
    return `value ${value}`
  }
}

enum NumberEnum {
  A = 1,
  B = 2,
}

enum AugmentedNumberEnum {
  A = 1,
  B = 2,
}

namespace AugmentedNumberEnum {
  export function describe(value: AugmentedNumberEnum) {
    return `value ${value}`
  }
}
