import { JsonLdProxy } from 'rdf-form';
import { presentationUri, slideUri, base } from '../../../shared-helpers/constants'
import slugify from '../helpers/slugify'
import { expand, compact } from 'jsonld'
import { app } from '../App'
import { loadStyle } from '../../../shared-helpers/loadStyle'
import { hash } from '../helpers/hash';
import { goTo } from '../helpers/goTo';
import { getFirst } from '../helpers/getFirst';
import { collapse } from '../helpers/collapse';

export const dereferenceCache = new Map()

class StateClass extends EventTarget {

  #presentation: {} = {
    '@type': [`${presentationUri}Presentation`],
    [`${presentationUri}slides`]: []
  }

  context = { 
    'presentation': presentationUri,
    'slide': slideUri 
  }

  #proxy = null

  set presentation (value) {
    this.#presentation = value
  }

  get presentation () {
    if (!this.#proxy) {
      this.#proxy = JsonLdProxy(this.#presentation, this.context, {
        '__': (value) => collapse(getFirst(value), this.context)
      })
    }
    return this.#proxy
  }

  async open () {
    const [handle] = await window.showOpenFilePicker({
      types: [{
        description: 'Presentation',
        accept: {'application/presentation': ['.pres']},
      }]
    })

    await this.load(handle)
    await app.render()
    app.scaleSlides()
  }

  async load (handle: FileSystemFileHandle) {
    this.#proxy = null
    const file = await handle.getFile()
    const json = await file.text()
    this.#presentation = (await expand(JSON.parse(json)))[0]

    let env = dereferenceCache.get(State.presentation['presentation:domain']?._)

    if (!env && this.presentation['presentation:domain']?._) {
      const htmlText = await fetch(this.presentation['presentation:domain']?._).then(response => response.text())
      const jsonText = htmlText.split('<script type="application/json" id="env-json">')[1].split('</script>')[0]
      env = JSON.parse(jsonText)
      dereferenceCache.set(this.presentation['presentation:domain']?._, env)
    }

    if (env?.styles) await loadStyle(env.styles)
  }

  async save () {
    const handle = await window.showSaveFilePicker({
      suggestedName: slugify(this.presentation['presentation:title']?._) + '.pres',
      types: [{
        description: 'Presentation',
        accept: {'application/presentation': ['.pres']},
      }]
    })

    const writableStream = await handle.createWritable()
    this.presentation['@context'] = this.context
    const fileUri = `${base}/${handle.name.substring(0, handle.name.length - 5)}`
    if (!this.presentation['@id']) this.presentation['@id'] = fileUri

    for (const slide of this.presentation['presentation:slides']) {
      slide['@id'] = slide['@id'].replace('temp://', fileUri + '#')
    }

    const collapsedData = await compact(this.presentation.$, this.context)

    const json = JSON.stringify(collapsedData, null, 2)
    const blob = new Blob([json], { type: 'application/presentation' })
    const stream = blob.stream();
    await stream.pipeTo(writableStream);
  }

  createSlide (beforeIndex) {
    const newSlide = {
      '@id': 'temp://' + hash(performance.now().toString(36)),
      '@context': this.context,
      '@type': ['slide:Slide'],
    }
    this.presentation['presentation:slides'].splice(beforeIndex, 0, newSlide)
    app.render()
  }

  createReference (beforeIndex) {
    const newSlide = {
      '@id': 'temp://' + hash(performance.now().toString(36)),
      '@context': this.context,
      '@type': ['slide:Reference'],
    }
    this.presentation['presentation:slides'].splice(beforeIndex, 0, newSlide)
    app.render()  }

  deleteSlide (index) {
    this.presentation['presentation:slides'].splice(index, 1)
    goTo('/presentation')
  }
}
export const State = new StateClass()