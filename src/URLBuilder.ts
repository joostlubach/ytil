export type URLBuilder = (path?: string) => string

export namespace URLBuilder {
  export function create(base: URL): URLBuilder {
    return path => {
      const url = new URL(base.href)
      if (path != null) {
        url.pathname = `${base.pathname.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
      }
      return url.href
    }
  }
}
