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