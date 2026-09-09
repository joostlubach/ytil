export function isURL(url: string, strict: boolean = true) {
  if (strict) {
    return regexps.urlStrict.test(url)
  } else {
    return regexps.urlLoose.test(url)
  }
}

export function coerceURL(url: string) {
  if (regexps.urlStrict.test(url)) {
    return url
  } else if (regexps.urlLoose.test(url)) {
    return `https://${url}`
  } else {
    return null
  }
}

export function isFileURL(url: string) {
  return regexps.fileURL.test(url)
}

export function isHTTPURL(url: string) {
  return regexps.httpURL.test(url)
}

export function isImageURL(url: string) {
  return regexps.imageURL.test(url)
}

export function isURI(uri: string) {
  return regexps.uri.test(uri)
}

export function isEmail(email: string) {
  return regexps.email.test(email)
}

export function ensureHTTPS(url: string): string {
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(url)) {
    return 'https://' + url
  }
  return url
}


export const regexps = {
  urlStrict: /^https?:\/\/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}(?::(\d+))?(\/.*?)?(\?.*?)?(#.*?)?$/i,
  urlLoose:  /^(?:https?:\/\/)?(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}(?::(\d+))?(\/.*?)?(\?.*?)?(#.*?)?$/i,
  fileURL:   /^file:\/\//i,
  httpURL:   /^https?:\/\//i,
  imageURL:  /^https?:\/\/.*\.(jpg|jpeg|png|gif|bmp|webp|svg|ico|avif)(\?.*?)?(#.*?)?$/i,
  uri:       /^[a-z][a-z0-9+.-]+:[^\s]+$/,
  email:     /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
}