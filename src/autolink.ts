const PROTOCOL_REGEXP = /^(?:https?|mailto|ftp|tel):(\w|\/)/i
const EMAIL_REGEXP    = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}])|(([\w\-\d]+\.)+[\w]{2,}))$/i
const WEB_REGEXP      = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i
const PHONE_REGEXP    = /^\s*[-+()\d\s]{3,}\s*$/i

/**
 * Finds a single link in a text and returns it.
 *
 * @param text The text to find the links in.
 * @returns The found link.
 */
export function autolinkHref(text: string): string | null {
  // Check for email.
  if (PROTOCOL_REGEXP.test(text)) {
    return text
  } else if (EMAIL_REGEXP.test(text)) {
    return `mailto:${text}`
  } else if (WEB_REGEXP.test(text)) {
    return `http://${text}`
  } else if (PHONE_REGEXP.test(text)) {
    return `tel://${text}`
  } else {
    return null
  }
}