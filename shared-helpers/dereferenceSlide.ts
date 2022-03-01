import { JsonLdProxy } from "rdf-form"
import { context } from "./constants"
import { lastPart } from "./lastPart"
import { expand } from 'jsonld'

export const dereferenceSlide = async (url: string) => {
  const response = await fetch(url)
  const html = await response.text()
  const envText = html.split('<script type="application/json" id="env-json">')[1].split('</script>')[0]
  const env = JSON.parse(envText)

  const [,,,identifier, slideIdentifier] = url.split('/')

  const presentationResponse = await fetch(env.presentation_url.replace('${identifier}', identifier))
  const presentation = await presentationResponse.json()
  const presentationExpanded = await expand(presentation)
  console.log(presentationExpanded)
  const proxy = JsonLdProxy(presentationExpanded, context)
  const slide = proxy['presentation:slides'].find((slide: any) => lastPart(slide['@id']) === slideIdentifier)
  return slide
}