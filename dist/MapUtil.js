export class MapUtil {
    static sparse(map) {
        const result = new Map();
        for (const [key, value] of map.entries()) {
            if (value == null) {
                continue;
            }
            result.set(key, value);
        }
        return result;
    }
    static mapToObject(map) {
        return Object.fromEntries(map.entries());
    }
    static ensure(map, key, defaultValue) {
        const value = map.get(key);
        if (value !== undefined) {
            return value;
        }
        const newValue = defaultValue();
        map.set(key, newValue);
        return newValue;
    }
}
