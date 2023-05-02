export declare abstract class MapUtil {
    static sparse<K extends PropertyKey, V>(map: Map<K, V | null | undefined>): Map<K, V>;
    static mapToObject<K extends PropertyKey, V>(map: Map<K, V>): Record<K, V>;
    static ensure<K extends PropertyKey, V>(map: Map<K, V>, key: K, defaultValue: () => V): V;
    static ensure<K extends object, V>(map: WeakMap<K, V>, key: K, defaultValue: () => V): V;
}
