export function prefixer(prefix: string | null | undefined, options: PrefixOptions = {}) {
  if (prefix == null) {
    return (subject: string) => subject
  } else {
    return (subject: string) => [prefix, subject].join(options.separator ?? '.')
  }
}

export function unprefixer(prefix: string | null | undefined, options: PrefixOptions = {}) {
  if (prefix == null) {
    return (subject: string) => subject
  } else {
    const prefixWithSeparator = prefix + (options.separator ?? '.')
    return (subject: string) => {
      if (subject.startsWith(prefixWithSeparator)) {
        return subject.slice(prefixWithSeparator.length)
      } else {
        return subject
      }
    }
  }
}

export interface PrefixOptions {
  separator?: string
}