import { cleanTextValue } from './text'

export type InitialsDerivable =
  | string
  | {name: string}
  | {firstName: string, lastName?: string | null}

export function deriveInitials(arg: InitialsDerivable) {
  let parts: string[]
  if (typeof arg === 'string') {
    parts = arg.split(' ', 2)
  } else if ('firstName' in arg) {
    parts = [
      cleanTextValue(arg.firstName),
      cleanTextValue(arg.lastName),
    ].filter(Boolean) as string[]
  } else {
    parts = [arg.name]
  }

  return parts.map(part => part.slice(0, 1)).join('')
}
