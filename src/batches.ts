export function *enumerateBatches<T>(input: Iterable<T>, batchSize: number): Generator<T[]> {
  let batch: T[] = []
  for (const item of input) {
    batch.push(item)
    if (batch.length >= batchSize) {
      yield batch
      batch = []
    }
  }
  if (batch.length > 0) {
    yield batch
  }
}

export function *enumerateBatchRanges(total: number, batchSize: number): Generator<[number, number]> {
  let start = 0
  while (start < total) {
    const end = Math.min(start + batchSize, total)
    yield [start, end]
    start = end
  }
}