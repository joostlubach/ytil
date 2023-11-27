import { isEqual, some } from 'lodash'

export abstract class SetOperations {

  public static diff<T>(arr1: T[], arr2: T[], equals: ((left: T, right: T) => boolean) = isEqual): T[] {
    return arr1.filter(it1 => !some(arr2, it2 => equals(it1, it2)))
  }

  public static intersection<T>(arr1: T[], arr2: T[], equals: ((left: T, right: T) => boolean) = isEqual): T[] {
    return arr1.filter(it1 => some(arr2, it2 => equals(it1, it2)))
  }

}
