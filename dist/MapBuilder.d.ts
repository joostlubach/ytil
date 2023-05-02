export declare abstract class MapBuilder {
    static by<It, K>(items: It[], keyForItem: (item: It) => K): Map<K, It>;
    static by<It, K, V>(items: It[], keyForItem: (item: It) => K, valueForItem: (value: It) => V): Map<K, V>;
    static groupBy<It, K>(items: It[], keyForItem: (item: It) => K): Map<K, It[]>;
    static groupBy<It, K, V>(items: It[], keyForItem: (item: It) => K, valueForItem: (value: It) => V): Map<K, V[]>;
}
