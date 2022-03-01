export const lastPart = (text: string) => {
  return text.split(/\:|\/|\,|\#/).pop()
}