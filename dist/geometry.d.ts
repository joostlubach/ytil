export declare function rectsIntersect(rect1: LayoutRect | Rect, rect2: LayoutRect | Rect): boolean;
export declare function offsetBounds(bounds: LayoutRect, delta: Point): {
    left: number;
    top: number;
    width: number;
    height: number;
};
export declare function expandRect(rect: Rect, insets: number | Partial<Insets>): {
    x: number;
    y: number;
    width: number;
    height: number;
};
export declare function rectExtents(rect: Rect): Point[];
export declare function resizeBoundsBy(bounds: LayoutRect, handlePoint: Point, delta: Point, options?: ResizeBoundsOptions): {
    left: number;
    top: number;
    width: number;
    height: number;
};
export declare function resizeBoundsTo(bounds: LayoutRect, handlePoint: Point, size: Size, options?: ResizeBoundsOptions): {
    top: number;
    left: number;
    width: number;
    height: number;
};
export interface Point {
    x: number;
    y: number;
}
export interface Size {
    width: number;
    height: number;
}
export interface Insets {
    top: number;
    right: number;
    bottom: number;
    left: number;
}
export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface ResizeBoundsOptions {
    roundTo?: number;
    minimumWidth?: number;
    minimumHeight?: number;
}
export interface LayoutRect {
    top: number;
    left: number;
    width: number;
    height: number;
}
