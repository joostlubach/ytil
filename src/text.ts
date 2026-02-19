export function cleanTextValue(value: string | null | undefined, trim: boolean = false): string | null {
  if (value == null) { return null }

  if (trim) {
    value = value.replace(/^[\r\n\s\u{200B}]+|[\r\n\s\u{200B}]+$/gu, '')
  }

  return value === '' ? null : value
}

export function blockTrim(text: string) {
  return text.trim().split('\n').map(line => line.trim()).join('\n')
}

export function stringContains(string: string, word: string) {
  return slugify(string).includes(slugify(word))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD') // Remove accents
    .replace(/[\u0300-\u036f]/g, '') // Remove accents, part 2
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-|-$/g, '')
}

export function stringHash(str: string) {
  let hash = 0

  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i)
     
    hash = ((hash << 5) - hash) + chr
     
    hash >>>= 0
  }

  return hash
}

export function truncate(text: string, length: number, options: TruncateOptions = {}) {
  const {
    ellipsis = ' … ',
    anchor = TextAnchor.Start,
  } = options

  if (text.length <= length) { return text }

  let lengthStart = 0
  let lengthEnd = 0

  switch (anchor) {
  case TextAnchor.Start:
    // Text is anchored at the start, get all the characters from the start.
    lengthStart = length - ellipsis.length
    lengthEnd = 0
    break
  case TextAnchor.End:
    // Text is anchored at the end, get all the characters from the end.
    lengthStart = 0
    lengthEnd = length - ellipsis.length
    break
  case TextAnchor.Middle:
    // Text is anchored at the middle. Get as many characters from the start and the end.
    // In case of odd length, the start gets the extra character.
    lengthStart = Math.ceil(length / 2 - ellipsis.length / 2)
    lengthEnd = Math.floor(length / 2 - ellipsis.length / 2)
    break
  }

  return text.slice(0, lengthStart) + ellipsis + text.slice(-lengthEnd)
}

export interface TruncateOptions {
  ellipsis?: string
  anchor?:   TextAnchor
}

export enum TextAnchor {
  Start,
  Middle,
  End
}