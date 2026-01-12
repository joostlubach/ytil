import { hasMethod } from './functions'

export function readBlob(blob: Blob): Promise<Uint8Array> {
  if (hasMethod(blob, 'bytes', 0)) {
    return blob.bytes()
  } else {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onerror = () => {
        reject(reader.error ?? new Error('Failed to read blob'))
      }
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(new Uint8Array(reader.result))
        } else {
          reject(new Error('Unexpected result type'))
        }
      }

      reader.readAsArrayBuffer(blob)
    })
  }
}