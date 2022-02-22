import Reveal from 'reveal.js/js/index';
import Highlight from 'reveal.js/plugin/highlight/highlight.esm.js';
import Notes from 'reveal.js/plugin/notes/notes.esm.js';
import Markdown from 'reveal.js/plugin/markdown/markdown.esm.js';
import { JsonLdProxy } from 'rdf-form';
import { loadStyle } from './helpers/loadStyle';
import { slideToHtml } from './helpers/slideToHtml';
import { slideToObject } from './helpers/slideToObject';

const env = JSON.parse(document.querySelector('#env-json').innerHTML)
const dataUrl = (identifier: string) => env.presentation_url.replace("${identifier}", identifier);

if (env.styles) loadStyle(env.styles)

;(async () => {
   const [identifier, slide] = location.pathname.substr(1).split('/')
   if (!identifier) throw new Error('Please open the site with a presentation identifier')

   const response = await fetch(dataUrl(identifier))
   const presentation = JsonLdProxy(await response.json(), {
      'presentation': `https://localhost:3000/ttl/presentation.ttl#`,
      'slide': `https://localhost:3000/ttl/slide.ttl#`
   })

   const originalReplaceState = history.replaceState
   history.replaceState = (_a, _b, url) => {
    url = url.toString().replace('#', '/' + identifier)
    originalReplaceState.apply(history, [_a, _b, url])
  }

  document.querySelector('#slides').innerHTML = presentation['presentation:slides']
  .map(slide => slideToHtml(slideToObject(slide))).join('')

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
  }

  window.addEventListener('resize', () => {
    const factor = 1280 / window.innerWidth

    deck.configure({ 
      width: 1280,
      height: window.innerHeight * factor,  
    });
  })
})()

