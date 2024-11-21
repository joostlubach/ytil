export function rectsIntersect(rect1: LayoutRect | Rect, rect2: LayoutRect | Rect) {
  const x1 = (rect1 as LayoutRect).left ?? (rect1 as Rect).x
  const y1 = (rect1 as LayoutRect).top ?? (rect1 as Rect).y
  const x2 = (rect2 as LayoutRect).left ?? (rect2 as Rect).x
  const y2 = (rect2 as LayoutRect).top ?? (rect2 as Rect).y
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
    top:    bounds.top + delta.y,
    width:  bounds.width,
    height: bounds.height,
  }
}

export function expandRect(rect: Rect, insets: number | Partial<Insets>) {
  const inset = (prop: keyof Insets) => typeof insets === 'number' ? insets : (insets[prop] ?? 0)

  return {
    x:      rect.x - inset('left'),
    y:      rect.y - inset('top'),
    width:  rect.width + inset('left') + inset('right'),
    height: rect.height + inset('top') + inset('bottom'),
  }
}

export function rectExtents(rect: Rect): Point[] {
  return [
    {x: rect.x, y: rect.y},
    {x: rect.x + rect.width, y: rect.y},
    {x: rect.x + rect.width, y: rect.y + rect.height},
    {x: rect.x, y: rect.y + rect.height},
  ]
}

export function resizeBoundsBy(bounds: LayoutRect, handlePoint: Point, delta: Point, options: ResizeBoundsOptions = {}) {
  const {roundTo, minimumWidth = 0, minimumHeight = 0} = options

  const round = (num: number) => roundTo == null ? num : Math.round(num / roundTo) * roundTo

  const left = round(bounds.left + (handlePoint.x < 0.5 ? delta.x : 0))
  const top = round(bounds.top + (handlePoint.y < 0.5 ? delta.y : 0))
  const right = round(bounds.left + bounds.width + (handlePoint.x > 0.5 ? delta.x : 0))
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

  const nextWidth = Math.max(size.width, minimumWidth)
  const nextHeight = Math.max(size.height, minimumHeight)

  if (handlePoint.x < 0.5) {
    nextBounds.left += (bounds.width - nextWidth)
    nextBounds.width = nextWidth
  } else if (handlePoint.x !== 0.5) {
    nextBounds.width = nextWidth
  }
  if (handlePoint.y < 0.5) {
    nextBounds.top += (bounds.height - nextHeight)
    nextBounds.height = nextHeight
  } else if (handlePoint.y !== 0.5) {
    nextBounds.height = nextHeight
  }

  nextBounds.top = round(nextBounds.top)
  nextBounds.left = round(nextBounds.left)
  nextBounds.width = round(nextBounds.width)
  nextBounds.height = round(nextBounds.height)

  return nextBounds
}

export function makeGrid(rects: LayoutRect[][], options: MakeGridOptions = {}): Rect[][] {
  const {straight = false, relativeTo} = options
  if (rects.length === 0 || rects[0].length === 0) { return [] }

  const offset = relativeTo ? {x: relativeTo.left, y: relativeTo.top} : {x: 0, y: 0}
  const lefts = rects[0].map(rect => rect.left)

  return rects.map(row => row.map((rect, j) => {
    const x = (straight ? lefts[j] : rect.left) - offset.x
    const y = rect.top - offset.y
    
    const width = straight && j < lefts.length - 1 ? lefts[j + 1] - rect.left : rect.width
    const height = rect.height

    return {x, y, width, height}
  }))
}

export interface MakeGridOptions {
  /** If true, it will use only the first row of the rects to determine x-coordinates. */
  straight?: boolean

  /** If set, it will calculate the x and y coordinates of the resulting rectangles as relative to this rect. */
  relativeTo?: LayoutRect
}

export interface Point {
  x: number
  y: number
}

export interface Size {
  width:  number
  height: number
}

export interface Insets {
  top:    number
  right:  number
  bottom: number
  left:   number
}

export interface Rect {
  x:      number
  y:      number
  width:  number
  height: number
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
