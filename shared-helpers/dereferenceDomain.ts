export const dereferenceDomain = async (url: string) => {
  const response = await fetch(url)
  const html = await response.text()
  const envText = html.split('<script type="application/json" id="env-json">')?.[1]?.split('</script>')?.[0]
  if (envText) {
    const env = JSON.parse(envText)
    return env  
  }
}