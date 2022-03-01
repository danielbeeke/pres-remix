import { JsonLdProxy } from "rdf-form"
import { State } from '../core/State'
import { lastPart } from '../../../shared-helpers/lastPart'
import { dereferenceDomain } from '../../../shared-helpers/dereferenceDomain'

export const dereferenceSlide = async (url) => {
  const env = await dereferenceDomain(url) as any
  const [,,,identifier, slideIdentifier] = url.split('/')

  const presentationResponse = await fetch(env.presentation_url.replace('${identifier}', identifier))
  const presentation = await presentationResponse.json()
  const proxy = JsonLdProxy(presentation, State.context)
  const slide = proxy['presentation:slides'].find(slide => lastPart(slide['@id']) === slideIdentifier)
  return slide
}