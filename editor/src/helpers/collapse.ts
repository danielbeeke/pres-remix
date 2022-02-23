export const collapse = (string, context) => {
  const stringSplit = string.split('#')

  for (const [alias, prefix] of Object.entries(context)) {
    if (prefix === stringSplit[0] + '#') return alias + ':' + stringSplit[1]
  }
  return string
}