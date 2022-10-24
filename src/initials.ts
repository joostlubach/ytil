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
      cleanTextValue((arg as any).firstName),
      cleanTextValue((arg as any).lastName),
    ].filter(Boolean) as string[]
  } else {
    parts = [(arg as any).name]
  }

  return parts.map(part => part.slice(0, 1)).join('')
}