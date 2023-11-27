const replacements: Array<[RegExp, string]> = [
  [/\*/g, '\\*'],
  [/#/g, '\\#'],
  [/\//g, '\\/'],
  [/\(/g, '\\('],
  [/\)/g, '\\)'],
  [/\[/g, '\\['],
  [/\]/g, '\\]'],
  [/</g, '&lt;'],
  [/>/g, '&gt;'],
  [/_/g, '\\_'],
]

export function escapeMarkdown(text: string) {
  for (const [find, replace] of replacements) {
    text = text.replace(find, replace)
  }
  return text
}
