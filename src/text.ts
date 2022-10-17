export function cleanTextValue(value: string | null | undefined, trim = false): string | null {
  if (value == null) { return null }

  if (trim) {
    value = value.trim()
  }

  return value === '' ? null : value
}