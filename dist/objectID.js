const ids = new WeakMap();
let nextID = 0;
export function objectID(obj) {
    if (obj == null) {
        return obj;
    }
    if (typeof obj !== 'object' && typeof obj !== 'function') {
        return obj;
    }
    if (ids.has(obj)) {
        return ids.get(obj);
    }
    const id = nextID++;
    ids.set(obj, id);
    return id;
}
