export declare class Matrix3D {
    constructor(values: number[] | number[][]);
    private readonly values;
    static parseTransform(transform: string): Matrix3D | null;
    get rotateX(): number;
    get rotateY(): number;
    get rotateZ(): number;
}
