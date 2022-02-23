import { JsonLdProxy } from "rdf-form"
import { State } from "../core/State"
import { lastPart } from "./lastPart"

export const dereferenceSlide = async (url) => {
  const response = await fetch(url)
  const html = await response.text()
  const envText = html.split('<script type="application/json" id="env-json">')[1].split('</script>')[0]
  const env = JSON.parse(envText)

  const [,,,identifier, slideIdentifier] = url.split('/')

  const presentationResponse = await fetch(env.presentation_url.replace('${identifier}', identifier))
  const presentation = await presentationResponse.json()
  const proxy = JsonLdProxy(presentation, State.context)
  const slide = proxy['presentation:slides'].find(slide => lastPart(slide['@id']) === slideIdentifier)
  return slide
}