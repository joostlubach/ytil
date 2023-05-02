import { isEqual, some } from 'lodash';
export class SetOperations {
    static diff(arr1, arr2, equals = isEqual) {
        return arr1.filter(it1 => !some(arr2, it2 => equals(it1, it2)));
    }
    static intersection(arr1, arr2, equals = isEqual) {
        return arr1.filter(it1 => some(arr2, it2 => equals(it1, it2)));
    }
}
