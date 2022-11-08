export interface SVGPathOptions {
  roundCorners?: number
  close?:        boolean
}

export function svgPath(points: Point[], options: SVGPathOptions = {}): string {
  if (points.length === 0) { return '' }

  const {
    roundCorners = 0,
  } = options

  const [head, ...tail] = points

  let path = `M ${head.x} ${head.y}`
  for (const [index, point] of tail.entries()) {
    const prevPoint = points[index]
    const nextPoint = options.close && index === tail.length - 1
      ? head
      : tail[index + 1]

    path += ' '

    if (nextPoint == null || roundCorners === 0) {
      path += `L ${point.x} ${point.y}`
    } else {
      const l1 = Math.sqrt((point.x - prevPoint.x) ** 2 + (point.y - prevPoint.y) ** 2)
      const l2 = Math.sqrt((point.x - nextPoint.x) ** 2 + (point.y - nextPoint.y) ** 2)
      if (l1 === 0 || l2 === 0) {
        path += `L ${point.x} ${point.y}`
        continue
      }

      const r1 = roundCorners / Math.max(l1, roundCorners)
      const r2 = roundCorners / Math.max(l2, roundCorners)

      const p1 = {
        x: point.x - (point.x - prevPoint.x) * r1,
        y: point.y - (point.y - prevPoint.y) * r1,
      }
      const p2 = {
        x: point.x - (point.x - nextPoint.x) * r2,
        y: point.y - (point.y - nextPoint.y) * r2,
      }

      path += `L ${p1.x} ${p1.y} `
      path += `Q ${point.x} ${point.y} ${p2.x} ${p2.y}`
    }
  }

  if (options.close) {
    path += ' Z'
  }

  return path
}