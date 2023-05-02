import { isArray } from 'lodash';
export class MapBuilder {
    static by(items, keyForItem, valueForItem) {
        const result = new Map();
        for (const item of items) {
            const key = keyForItem(item);
            const value = valueForItem == null ? item : valueForItem(item);
            result.set(key, value);
        }
        return result;
    }
    static groupBy(items, keyForItem, valueForItem) {
        const result = new Map();
        for (const item of items) {
            const key = keyForItem(item);
            const keys = isArray(key) ? key : [key];
            const value = valueForItem == null ? item : valueForItem(item);
            for (const key of keys) {
                const resultItem = result.get(key) ?? [];
                result.set(key, resultItem);
                resultItem.push(value);
            }
        }
        return result;
    }
}
