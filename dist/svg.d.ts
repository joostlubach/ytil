import { Point } from './geometry';
export interface SVGPathOptions {
    roundCorners?: number | number[];
    close?: boolean;
}
export declare function svgPath(points: Point[], options?: SVGPathOptions): string;
