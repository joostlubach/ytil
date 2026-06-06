import { objectEntries } from './lodashext'
import { Primitive } from './types'

export type URLBuilder = (path?: string, params?: URLSearchParams | Record<string, Primitive>) => string

export namespace URLBuilder {
  export function create(base: URL | string): URLBuilder {
    return (path, params) => {
      const url = new URL(base instanceof URL ? base.href : base)
      if (path != null) {
        url.pathname = `${url.pathname.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
      }
      if (params instanceof URLSearchParams) {
        for (const [key, value] of params.entries()) {
          url.searchParams.append(key, value)
        }
      } else if (params != null) {
        for (const [key, value] of objectEntries(params)) {
          url.searchParams.append(key, value === true ? '1' : `${value}`)
        }
      }
      return url.href.replace(/\/+$/, '')
    }
  }
}
