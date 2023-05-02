export declare function select<V>(key: string | null | undefined, map: {
    [key: string]: V;
    default: V;
}): V;
export declare function select<V>(key: string | null | undefined, map: {
    [key: string]: V;
}): V | undefined;
