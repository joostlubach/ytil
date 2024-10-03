export async function filterAsync<T>(array: T[], predicate: (value: T) => Promise<any>): Promise<T[]> {
  const promises = array.map(predicate)
  const results = await Promise.all(promises)
  return array.filter((item, index) => !!results[index])
}

export async function mapAsync<T>(array: T[], predicate: (value: T) => Promise<any>): Promise<T[]> {
  const promises = array.map(predicate)
  return await Promise.all(promises)
}