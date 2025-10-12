export function *generateBatches<T>(input: Iterable<T>, batchSize: number): Iterable<T[]> {
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

export async function *generateBatchesAsync<T>(input: AsyncIterable<T>, batchSize: number): AsyncIterable<T[]> {
  let batch: T[] = []
  for await (const item of input) {
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

export function collectBatches<T>(input: Iterable<T[]>): T[] {
  const result: T[] = []
  for (const batch of input) {
    for (const item of batch) {
      result.push(item)
    }
  }
  return result
}

export async function collectBatchesAsync<T>(input: AsyncIterable<T[]>): Promise<T[]> {
  const result: T[] = []
  for await (const batch of input) {
    for (const item of batch) {
      result.push(item)
    }
  }
  return result
}