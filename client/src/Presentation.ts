/** @ts-ignore */
import Reveal from 'reveal.js/js/index';
/** @ts-ignore */
import Highlight from 'reveal.js/plugin/highlight/highlight.esm.js';
/** @ts-ignore */
import Notes from 'reveal.js/plugin/notes/notes.esm.js';
/** @ts-ignore */
import Markdown from 'reveal.js/plugin/markdown/markdown.esm.js';
import { JsonLdProxy } from 'rdf-form';
import { loadStyle } from '../../shared-helpers/loadStyle';
import { slideToHtml } from './helpers/slideToHtml';
import { slideToObject } from '../../shared-helpers/slideToObject';
import { context } from '../../shared-helpers/constants';
import { lastPart } from '../../shared-helpers/lastPart';
import { dereferenceSlide } from '../../shared-helpers/dereferenceSlide';
import { dereferenceDomain } from '../../shared-helpers/dereferenceDomain'

import 'uhtml/async'
import { expand } from 'jsonld'

const env = JSON.parse(document.querySelector('#env-json')!.innerHTML)
const dataUrl = (identifier: string) => env.presentation_url.replace("${identifier}", identifier);
if (env.styles) loadStyle(env.styles)

;(async () => {
  const [identifier, slide] = location.pathname.substr(1).split('/')
  if (!identifier) {
    const response = await fetch(dataUrl('_all'))
    const allPresentations = await response.json()
    document.body.innerHTML = allPresentations.presentations.map((presentation: { id: string }) => `
      <a class="link" href="/${presentation.id}">${presentation.id}</a>
    `).join('\n')

    return
  }

  const response = await fetch(dataUrl(identifier))
  const presentationDataRaw = await response.json()
  const presentationExpanded = await expand(presentationDataRaw)
  const presentation = JsonLdProxy(presentationExpanded[0], context)

  dereferenceDomain(presentation['presentation:domain']?._).then(env => {
    if (env.styles) loadStyle(env.styles)
  })

  document.head.querySelector('title')!.innerHTML = presentation['presentation:title']?._ ?? 'Presentation'

  // document.body.style.backgroundColor = presentation['presentation:color']?._

  const originalReplaceState = history.replaceState
  history.replaceState = (_a, _b, url) => {
    url = url!.toString().replace('#', '/' + identifier)
    originalReplaceState.apply(history, [_a, _b, url])
  }

  document.querySelector('#slides')!.innerHTML = (await Promise.all(presentation['presentation:slides']
  .map(async (slide: any) => {
    const typeRdf = slide['@type']?._ ?? ''
    const type = lastPart(typeRdf)?.toLowerCase()
    const loadedSlide = type === 'reference' ? await dereferenceSlide(slide['slide:url']?._) : slide
    return slideToHtml(slideToObject(loadedSlide))
  }))).join('')

  const factor = 1280 / window.innerWidth

  let deck = Reveal({
    plugins: [Markdown, Highlight, Notes],
    hash: true,
    margin: 0,
    width: 1280,
    height: window.innerHeight * factor,
    minScale: 0.1,
    maxScale: 10.0
  })

  deck.initialize()
  if (slide) {
    deck.addEventListener('ready', () => {
      const indices = deck.getIndices(document.getElementById(slide))
      deck.slide(indices.h, 0)
    }, { once: true })  

    deck.addEventListener('slidechanged', (event: any) => {
      document.body.style.background = getComputedStyle(event.currentSlide).backgroundColor
    })
  }

  window.addEventListener('resize', () => {
    const factor = 1280 / window.innerWidth

    deck.configure({ 
      width: 1280,
      height: window.innerHeight * factor,  
    });
  })
})()

