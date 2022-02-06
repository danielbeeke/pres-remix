import { JsonLdProxy } from './JsonLdProxy';
import { presentationUri, slideUri, base } from './constants'
import slugify from '../helpers/slugify'
import { compact, expand } from 'jsonld'

class StateClass extends EventTarget {

  #presentation: {} = {
    '@type': `${presentationUri}Presentation`,
    [`${presentationUri}slides`]: []
  }

  #context = { 
    'presentation': presentationUri,
    'slides': slideUri 
  }

  set presentation (value) {
    this.#presentation = value
  }

  get presentation () {
    return JsonLdProxy(this.#presentation, this.#context)
  }

  async load (handle: FileSystemFileHandle) {
    const file = await handle.getFile()
    const json = await file.text()
    this.#presentation = (await expand(JSON.parse(json)))[0]
  }

  async save () {
    const handle = await window.showSaveFilePicker({
      suggestedName: slugify(State.presentation['presentation:title']?._) + '.pres',
      types: [{
        description: 'Presentation',
        accept: {'application/presentation': ['.pres']},
      }]
    })

    const writableStream = await handle.createWritable()
    this.#presentation['@context'] = this.#context
    const fileUri = `${base}/${handle.name.substring(0, handle.name.length - 5)}`
    if (!this.#presentation['@id']) this.#presentation['@id'] = fileUri

    for (const slide of this.#presentation['presentation:slides']) {
      slide['@id'] = slide['@id'].replace('temp://', fileUri + '#')
    }

    const [collapsedData] = await expand(this.#presentation)
    const json = JSON.stringify(collapsedData, null, 2)
    const blob = new Blob([json], { type: 'application/presentation' })
    const stream = blob.stream();
    await stream.pipeTo(writableStream);
  }
}
export const State = new StateClass()