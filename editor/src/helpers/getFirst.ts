export const getFirst = (thing) => Array.isArray(thing) ? getFirst(thing[0]) : thing?.['@id'] ?? thing?.['@value'] ?? thing
