export function rectsIntersect(rect1, rect2) {
    const x1 = rect1.left ?? rect1.x;
    const y1 = rect1.top ?? rect1.y;
    const x2 = rect2.left ?? rect2.x;
    const y2 = rect2.top ?? rect2.y;
    const w1 = rect1.width;
    const h1 = rect1.height;
    const w2 = rect2.width;
    const h2 = rect2.height;
    if (x2 + w2 <= x1) {
        return false;
    }
    if (x2 >= x1 + w1) {
        return false;
    }
    if (y2 + h2 <= y1) {
        return false;
    }
    if (y2 >= y1 + h1) {
        return false;
    }
    return true;
}
export function offsetBounds(bounds, delta) {
    return {
        left: bounds.left + delta.x,
        top: bounds.top + delta.y,
        width: bounds.width,
        height: bounds.height,
    };
}
export function expandRect(rect, insets) {
    const inset = (prop) => typeof insets === 'number' ? insets : (insets[prop] ?? 0);
    return {
        x: rect.x - inset('left'),
        y: rect.y - inset('top'),
        width: rect.width + inset('left') + inset('right'),
        height: rect.height + inset('top') + inset('bottom'),
    };
}
export function rectExtents(rect) {
    return [
        { x: rect.x, y: rect.y },
        { x: rect.x + rect.width, y: rect.y },
        { x: rect.x + rect.width, y: rect.y + rect.height },
        { x: rect.x, y: rect.y + rect.height },
    ];
}
export function resizeBoundsBy(bounds, handlePoint, delta, options = {}) {
    const { roundTo, minimumWidth = 0, minimumHeight = 0 } = options;
    const round = (num) => roundTo == null ? num : Math.round(num / roundTo) * roundTo;
    const left = round(bounds.left + (handlePoint.x < 0.5 ? delta.x : 0));
    const top = round(bounds.top + (handlePoint.y < 0.5 ? delta.y : 0));
    const right = round(bounds.left + bounds.width + (handlePoint.x > 0.5 ? delta.x : 0));
    const bottom = round(bounds.top + bounds.height + (handlePoint.y > 0.5 ? delta.y : 0));
    return {
        left,
        top,
        width: Math.max(right - left, minimumWidth),
        height: Math.max(bottom - top, minimumHeight),
    };
}
export function resizeBoundsTo(bounds, handlePoint, size, options = {}) {
    const { roundTo, minimumWidth = 0, minimumHeight = 0 } = options;
    const nextBounds = { ...bounds };
    const round = (num) => roundTo == null ? num : Math.round(num / roundTo) * roundTo;
    const nextWidth = Math.max(size.width, minimumWidth);
    const nextHeight = Math.max(size.height, minimumHeight);
    if (handlePoint.x < 0.5) {
        nextBounds.left += (bounds.width - nextWidth);
        nextBounds.width = nextWidth;
    }
    else if (handlePoint.x !== 0.5) {
        nextBounds.width = nextWidth;
    }
    if (handlePoint.y < 0.5) {
        nextBounds.top += (bounds.height - nextHeight);
        nextBounds.height = nextHeight;
    }
    else if (handlePoint.y !== 0.5) {
        nextBounds.height = nextHeight;
    }
    nextBounds.top = round(nextBounds.top);
    nextBounds.left = round(nextBounds.left);
    nextBounds.width = round(nextBounds.width);
    nextBounds.height = round(nextBounds.height);
    return nextBounds;
}
