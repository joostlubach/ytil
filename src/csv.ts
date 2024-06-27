export function csvArrayToJSON(values: unknown[][], options: CSVArrayToJSONOptions = {}) {
  const body = [...values]
  const fields = options.fields ?? body.shift()?.map(it => `${it}`)
  if (fields == null) { return [] }

  const convertValue = (field: string, value: unknown) => {
    if (typeof value === 'string' && options.trim) {
      value = value.trim()
    }
    if (options.convert != null) {
      return options.convert(field, value)
    } else {
      return value
    }
  }

  const rowToJSON = (values: unknown[]) => {
    const item: Record<string, unknown> = {}
    for (const [index, field] of fields.entries()) {
      item[field] = convertValue(field, values[index])
    }
    return item
  }

  return body.map(rowToJSON)
}

export interface CSVArrayToJSONOptions {
  fields?:  string[]
  trim?:    boolean
  convert?: (field: string, value: unknown) => unknown
}
