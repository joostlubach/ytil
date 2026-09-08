export function abortable<T>(promise: Promise<T>, signal?: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    promise.then((...args) => {
      if (signal?.aborted) { return }
      return resolve(...args)
    }, (...args) => {
      if (signal?.aborted) { return }
      return reject(...args)
    } )
  })
}
