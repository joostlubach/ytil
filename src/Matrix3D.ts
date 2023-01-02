export class Matrix3D {

  constructor(
    values: number[] | number[][],
  ) {
    if (values.length === 4) {
      this.values = values as number[][]
      for (const row of this.values) {
        if (row.length !== 4) {
          throw new RangeError('Matrix3D must have 4 columns');
        }
      }
    } else if (values.length === 16) {
      this.values = [
        (values as number[]).slice(0, 4),
        (values as number[]).slice(4, 8),
        (values as number[]).slice(8, 12),
        (values as number[]).slice(12, 16),
      ]
    } else {
      throw new RangeError('Values be either 4 rows or 16 values');
    }
  }

  private readonly values: number[][]

  public static parseTransform(transform: string) {
    const matrixMatch = transform.match(/matrix3d\s*\(\s*(.+)\s*\)/);
    if (matrixMatch != null) {
      const values = matrixMatch[1].split(',').map((value) => parseFloat(value.trim()))
      return new Matrix3D(values)
    }

    // TODO: Parse all other CSS props.
    return null
  }

  public get rotateX() {
    return Math.atan2(-this.values[1][2], this.values[2][2])
  }

  public get rotateY() {
    return Math.atan2(this.values[0][2], this.values[0][0])
  }

  public get rotateZ() {
    return Math.atan2(-this.values[0][1], this.values[1][1])
  }

}