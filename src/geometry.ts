export function rectsIntersect(rect1: LayoutRect | Rect, rect2: LayoutRect | Rect) {
  const x1 = (rect1 as any).left ?? (rect1 as any).x
  const y1 = (rect1 as any).top ?? (rect1 as any).y
  const x2 = (rect2 as any).left ?? (rect2 as any).x
  const y2 = (rect2 as any).top ?? (rect2 as any).y
  const w1 = rect1.width
  const h1 = rect1.height
  const w2 = rect2.width
  const h2 = rect2.height

  if (x2 + w2 <= x1) { return false }
  if (x2 >= x1 + w1) { return false }
  if (y2 + h2 <= y1) { return false }
  if (y2 >= y1 + h1) { return false }

  return true
}

export function offsetBounds(bounds: LayoutRect, delta: Point) {
  return {
    left:   bounds.left + delta.x,
    top:    bounds.top  + delta.y,
    width:  bounds.width,
    height: bounds.height,
  }
}

export function resizeBoundsBy(bounds: LayoutRect, handlePoint: Point, delta: Point, options: ResizeBoundsOptions = {}) {
  const {roundTo, minimumWidth = 0, minimumHeight = 0} = options

  const round = (num: number) => roundTo == null ? num : Math.round(num / roundTo) * roundTo

  const left   = round(bounds.left + (handlePoint.x < 0.5 ? delta.x : 0))
  const top    = round(bounds.top + (handlePoint.y < 0.5 ? delta.y : 0))
  const right  = round(bounds.left + bounds.width + (handlePoint.x > 0.5 ? delta.x : 0))
  const bottom = round(bounds.top + bounds.height + (handlePoint.y > 0.5 ? delta.y : 0))

  return {
    left,
    top,
    width:  Math.max(right - left, minimumWidth),
    height: Math.max(bottom - top, minimumHeight),
  }
}

export function resizeBoundsTo(bounds: LayoutRect, handlePoint: Point, size: Size, options: ResizeBoundsOptions = {}) {
  const {roundTo, minimumWidth = 0, minimumHeight = 0} = options

  const nextBounds = {...bounds}
  const round = (num: number) => roundTo == null ? num : Math.round(num / roundTo) * roundTo

  const nextWidth  = Math.max(size.width, minimumWidth)
  const nextHeight = Math.max(size.height, minimumHeight)

  if (handlePoint.x < 0.5) {
    nextBounds.left  += (bounds.width - nextWidth)
    nextBounds.width = nextWidth
  } else if (handlePoint.x !== 0.5) {
    nextBounds.width = nextWidth
  }
  if (handlePoint.y < 0.5) {
    nextBounds.top  += (bounds.height - nextHeight)
    nextBounds.height = nextHeight
  } else if (handlePoint.y !== 0.5) {
    nextBounds.height = nextHeight
  }

  nextBounds.top    = round(nextBounds.top)
  nextBounds.left   = round(nextBounds.left)
  nextBounds.width  = round(nextBounds.width)
  nextBounds.height = round(nextBounds.height)

  return nextBounds
}

export interface ResizeBoundsOptions {
  roundTo?:       number
  minimumWidth?:  number
  minimumHeight?: number
}

export interface LayoutRect {
  top:    number
  left:   number
  width:  number
  height: number
}