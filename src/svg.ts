import { range } from 'lodash'
import { objectKeys, objectValues } from 'ytil'
import { Point, Rect } from './geometry'

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

    path += `${first ? 'M' : 'L'} ${p1.x},${p1.y} `
    if (p2 != null) {
      path += `Q ${p2.x},${p2.y} ${p3.x},${p3.y} `
    }
    first = false
  }

  if (options.close) {
    path += ' Z'
  }

  return path
}

/**
 * Generates a set of paths (as coordinate arrays) that outline any contiguous regions of "selected" boxes in
 * a grid, using the "marching squares" algorithm, or at least some adaptation of it that made sense to me.
 * 
 * Note that in any path, the first and last points are the same, to indicate a closed path.
 *
 * @param grid 
 *   The layout of the grid, as a 2D array of layout rectangles. Each rectangle is {x, y, width, height}.
 *   If the rectangles have gaps between them, the algorithm will still work, but it might not be what you
 *   expect. But then again, it might be exactly what you expect, but anyway the algorithm expects the boxes
 *   to hug each other.
 * @param selected 
 *   A callback that returns true if the box at the given coordinates ([x, y]) is selected.
 * @returns
 *   An array of point-arrays, each indicating a closed path that outlines the contiguous regions of all
 *   selected boxes.
 */
export function generateOutlines(grid: Rect[][], selected: (coords: [number, number]) => boolean, options: GenerateOutlinesOptions = {}): Point[][] {
  if (grid.length === 0) { return [] }

  const rows = grid.length
  const cols = grid[0].length
  const {offset = 0} = options

  // Utility to check if a box is within bounds and selected
  function isSelected(coords: [number, number]): boolean {
    if (coords[0] < 0 || coords[0] >= cols) { return false }
    if (coords[1] < 0 || coords[1] >= rows) { return false }
    return selected(coords)
  }

  // Utility function to find all "start" boxes of all contiguous regions. Note that the "start"
  // box is arbitary, but it will always be a top-left corner of the region.
  function findContiguousRegionStarts() {
    const visited = new Set<string>() // To track visited boxes
  
    // Utility to mark a box as visited
    function markVisited(x: number, y: number) {
      visited.add(`${x},${y}`)
    }
  
    // Utility to check if a box is already visited
    function isVisited(x: number, y: number): boolean {
      return visited.has(`${x},${y}`)
    }
  
    // Find contiguous regions using a flood-fill-like algorithm
    function findRegion(startX: number, startY: number): Array<[number, number]> | null {
      const region: [number, number][] = []
      const stack: [number, number][] = [[startX, startY]]
  
      while (stack.length > 0) {
        const [x, y] = stack.pop()!
        if (!isSelected([x, y]) || isVisited(x, y)) continue

        markVisited(x, y)
        region.push([x, y])
        for (const [dx, dy] of objectValues(DIRECTIONS)) {
          stack.push([x + dx, y + dy])
        }
      }
  
      return region.length > 0 ? region : null
    }
  
    const starts: [number, number][] = []
  
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const region = findRegion(x, y) // Find a contiguous region
        if (region == null || region.length === 0) { continue }
  
        starts.push(region[0])
      }
    }

    return starts
  }
  
  // Trace the boundary of a contiguous region using the "marching squares" algorithm
  function traceBoundary(start: [number, number]): Point[] {
    // Start at the start point. Except that 'current' here points to the top-left corner of the box.
    let current = start
    let direction: Direction = 'right'

    // Utility function to find the layout rectangle for a box at x and y.
    const boxRect = (box: [number, number]) => {
      const rect = grid[box[1]]?.[box[0]]
      if (rect == null) {
        throw new Error(`Box at [${box[0]}, ${box[1]}] is out of bounds`)
      }
  
      return rect
    }

    // Standing at the given node, going in the given direction, find the box that is adjacent in front of you
    // at the given side.
    const adjacentBox = (node: [number, number], direction: Direction, side: 'left' | 'right'): [number, number] => {
      const [x, y] = node
      switch (direction) {
      case 'right': return side === 'left' ? [x, y - 1] : [x, y]
      case 'down': return side === 'left' ? [x, y] : [x - 1, y]
      case 'left': return side === 'left' ? [x - 1, y] : [x - 1, y - 1]
      case 'up': return side === 'left' ? [x - 1, y - 1] : [x, y - 1]
      }
    }

    // Utility function to follow a direction from a node (or box) to a new node (or box).
    const follow = (node: [number, number], direction: Direction): [number, number] => {
      const [x, y] = node
      const [dx, dy] = DIRECTIONS[direction]
      return [x + dx, y + dy]
    }

    // Utility function to turn clockwise.
    const turnDirection = (direction: Direction, turn: number): Direction => {
      const index = objectKeys(DIRECTIONS).indexOf(direction)
      return objectKeys(DIRECTIONS)[(index + turn) % 4] as Direction
    }

    // Utility function to find the most logical coordinate of the node, given the direction TO the node.
    // It will always use the "inside" rectangle to find the coordinate.
    const nodeCoords = (node: [number, number], direction: Direction, turn: number): Point => {
      let baseCoords: Point
      switch (direction) {
      case 'right': {
        // We are moving to the right to reach the node, so we need to top-right coordinate of the box
        // that is to the bottom left of this node.
        const box: [number, number] = [node[0] - 1, node[1]]
        const rect = boxRect(box)
        baseCoords = {x: rect.x + rect.width, y: rect.y}
        break
      }
      
      case 'down': {
        // We are moving down to reach the node, so we need to bottom-right coordinate of the box
        // that is to the top left of this node.
        const box: [number, number] = [node[0] - 1, node[1] - 1]
        const rect = boxRect(box)
        baseCoords = {x: rect.x + rect.width, y: rect.y + rect.height}
        break
      }

      case 'left': {
        // We are moving left to reach the node, so we need to bottom-left coordinate of the box
        // that is to the top right of this node.
        const box: [number, number] = [node[0], node[1] - 1]
        const rect = boxRect(box)
        baseCoords = {x: rect.x, y: rect.y + rect.height}
        break
      }

      case 'up': {
        // We are moving up to reach the node, so we need to top-left coordinate of the box
        // that is to the bottom right of this node.
        const box: [number, number] = [node[0], node[1]]
        const rect = boxRect(box)
        baseCoords = {x: rect.x, y: rect.y}
        break
      }
      }

      // For clockwise turns, add the offset for the right and down instructions, and subtract for the left and up.
      // For counter-clockwise turns, do the opposite.

      let offsetX: number
      let offsetY: number

      if (turn === TURNS.cw) {
        offsetX = (direction === 'right' || direction === 'down') ? offset : -offset
        offsetY = (direction === 'down' || direction === 'left') ? offset : -offset
      } else {
        offsetX = (direction === 'right' || direction === 'up') ? -offset : offset
        offsetY = (direction === 'left' || direction === 'up') ? offset : -offset
      }

      return {
        x: baseCoords.x + offsetX,
        y: baseCoords.y + offsetY,
      }
    }

    // Keep a loop counter to prevent infinite loops. Shouldn't happen, but it's tricky with this algorithm,
    // there is not a statically known number of iterations.
    let loop = 0

    // Build a list of directions and nodes. Start with the start node.
    const directions: Direction[] = []
    const turns: number[] = []
    const nodes: Array<[number, number]> = [start]

    // Keep track of the previous direction to detect turns. This allows us to log only the corner nodes.
    let prevDirection: Direction = direction

    do {
      if (loop++ > 1000) {
        throw new Error(`At: ${current[0]}, ${current[1]}: looped too many times`)
      }

      // Try each direction, starting with the current, to find one where the left hand box is unselected
      // and the right hand box is selected.
      let found: boolean = false
      let turn: number = 0
      for (const t of objectValues(TURNS)) {
        const dir = turnDirection(direction, t)

        const lefthandBox = adjacentBox(current, dir, 'left')
        const righthandBox = adjacentBox(current, dir, 'right')

        if (!isSelected(lefthandBox) && isSelected(righthandBox)) {
          // We found the direction to turn to.
          direction = dir
          turn = t
          found = true
          break
        }
      }

      // If we didn't find a direction, the earlier part of this algorithm did not correctly detect
      // a contiguous region.
      if (!found) {
        throw new Error(`At (${current[0]}, ${current[1]}): not a contiguous region`)
      }

      // Only if we changed direction, we need to log the node.
      if (direction !== prevDirection) {
        directions.push(prevDirection)
        nodes.push(current)
        turns.push(turn)
        prevDirection = direction
      }

      current = follow(current, direction)
    } while (current[0] !== start[0] || current[1] !== start[1])

    // Add a tinal clockwise turn.
    turns.push(TURNS.cw)

    // Now we will follow the directions to trace the boundary.
    const points: Point[] = []

    // Start at the first node. Because we always start at a top-left corner, add the topleft corner of the same box.
    points.push(nodeCoords(nodes[0], direction, TURNS.cw))

    for (let i = 1; i < nodes.length; i++) {
      const next = nodes[i]
      const direction = directions[i - 1]
      const turn = turns[i - 1]
      points.push(nodeCoords(next, direction, turn))
    }

    // Add the first point again. Always with a clockwise turn.
    points.push(nodeCoords(nodes[0], direction, turns[turns.length - 1]))

    return points
  }

  // Main algorithm.
  const starts = findContiguousRegionStarts()
  return starts.map(traceBoundary)
}

export interface GenerateOutlinesOptions {
  /**
   * If specified, will use this offset to adjust the coordinates of the boxes. As SVG doesn't have a concept
   * of "inside" and "outside" borders, this is essential to ensure that the path is drawn entirely inside 
   * the region.
   * 
   * Specify a negative number for "inside" and a positive number for "outside".
   */
  offset?: number
}

const DIRECTIONS = {
  right: [1, 0],
  down:  [0, 1],
  left:  [-1, 0],
  up:    [0, -1],
}

const TURNS = {
  straight: 0,
  cw:       1,
  ccw:      3,
}

type Direction = keyof typeof DIRECTIONS