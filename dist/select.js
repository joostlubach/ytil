export function select(key, map) {
    if (key && key in map) {
        return map[key];
    }
    else if ('default' in map) {
        return map.default;
    }
    else {
        return null;
    }
}
