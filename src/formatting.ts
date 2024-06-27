export function formatList(list: unknown[], headSeparator: string = ', ', tailSeparator: string = ' and ') {
  if (list.length === 0) { return '' }
  if (list.length === 1) { return `${list[0]}` }

  const head = [...list]
  const tail = head.pop()
  return [head.join(headSeparator), tail].join(tailSeparator)
}
