export function isURL(url: string) {
  return regexps.url.test(url)
}

export function isFileURL(url: string) {
  return regexps.fileURL.test(url)
}

export function isHttpURL(url: string) {
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


export const regexps = {
  url:      /^(https?:\/\/)?(.*?)(?::(\d+))?(.*?)?(\?.*?)?(#.*?)?$/,
  fileURL:  /^file:\/\//i,
  httpURL:  /^https?:\/\//i,
  imageURL: /^https?:\/\/.*\.(jpg|jpeg|png|gif|bmp|webp|svg|ico|avif)(\?.*?)?(#.*?)?$/i,
  uri:      /^\w+:/,
  email:    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
}