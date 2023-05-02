export declare abstract class SetOperations {
    static diff<T>(arr1: T[], arr2: T[], equals?: ((left: T, right: T) => boolean)): T[];
    static intersection<T>(arr1: T[], arr2: T[], equals?: ((left: T, right: T) => boolean)): T[];
}
