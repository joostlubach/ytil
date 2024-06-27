import { range } from 'lodash'

import { Point } from './geometry'

export interface SVGPathOptions {
  roundCorners?: number | number[]
  close?:        boolean
}

export function svgPath(points: Point[], options: SVGPathOptions = {}): string {
  if (points.length === 0) { return '' }

  const {
    roundCorners = 0,
  } = options

  const cornerRadiusAt = (index: number) => {
    if (typeof roundCorners === 'number') {
      return roundCorners
    } else {
      return roundCorners[index] ?? 0
    }
  }

  const cornerMetricsAt = (index: number): Point[] => {
    const point = points[index]
    const r = cornerRadiusAt(index)
    if (r === 0) { return [point] }

    let prevPoint: Point
    let nextPoint: Point
    if (options.close) {
      // If we close, we need to consider the opposite boundary points as neighbors.
      prevPoint = index === 0 ? points[points.length - 1] : points[index - 1]
      nextPoint = index === points.length - 1 ? points[0] : points[index + 1]
    } else {
      // Otherwise, we need to repeat the boundary points to ensure a straight end.
      prevPoint = index === 0 ? point : points[index - 1]
      nextPoint = index === points.length - 1 ? point : points[index + 1]
    }

    const l1 = Math.sqrt((point.x - prevPoint.x) ** 2 + (point.y - prevPoint.y) ** 2)
    const l2 = Math.sqrt((point.x - nextPoint.x) ** 2 + (point.y - nextPoint.y) ** 2)
    if (l1 === 0 || l2 === 0) {
      // No corner can be made.
      return [point]
    }

    const r1 = r / Math.max(l1, r)
    const r2 = r / Math.max(l2, r)

    const p1 = {
      x: point.x - (point.x - prevPoint.x) * r1,
      y: point.y - (point.y - prevPoint.y) * r1,
    }
    const p2 = {
      x: point.x - (point.x - nextPoint.x) * r2,
      y: point.y - (point.y - nextPoint.y) * r2,
    }

    return [p1, point, p2]
  }

  // Check if we need to start with a radius.
  const metrics = range(0, points.length).map(cornerMetricsAt)

  let first = true
  let path = ''

  for (const index of range(0, points.length)) {
    const [p1, p2, p3] = metrics[index]

    path += `${first ? 'M' : 'L'} ${p1.x} ${p1.y}`
    if (p2 != null) {
      path += `Q ${p2.x} ${p2.y} ${p3.x} ${p3.y}`
    }
    first = false
  }

  if (options.close) {
    path += ' Z'
  }

  return path
}
