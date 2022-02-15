const cache = {}

/**
 * A little helper so we are sure our object is rendered correctly when using html.for()``
 * @param string 
 * @returns 
 */
export const textToObject = (string) => {
  if (!cache[string]) cache[string] = { string }
  return cache[string]
}