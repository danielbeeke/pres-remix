import { html } from 'ube'
import 'rdf-form';
import { RdfForm } from 'rdf-form';
import { app } from '../App';
import { slideThumbnail } from '../helpers/slideThumbnail';
import { referenceFormUri } from '../core/constants';
import { State } from '../core/State';
import { lastPart } from '../../../shared-helpers/lastPart';
import { textToObject } from '../helpers/textToObject';
import { goTo } from '../helpers/goTo';
import { slideToObject } from '../../../shared-helpers/slideToObject';
import { dereferenceSlide } from '../helpers/dereferenceSlide';
import { dereferenceDomain } from '../helpers/dereferenceDomain';

const forms = {}

export const Reference = {

  async template (innerTemplates: Array<typeof html> = [], context) {
    const item = State.presentation['presentation:slides'].find(slide => lastPart(slide['@id']) === context.params.slide)
    this.data = item?.$

    if (!this.data) return goTo('/presentation')

    const slide = await dereferenceSlide(item['slide:url']?._)
    const preview = slideThumbnail(slideToObject(slide))

    let indexData
    if (State.presentation['presentation:domain']?._) {
      const env = await dereferenceDomain(State.presentation['presentation:domain']?._) as any
      const indexDataResponse = await fetch(env.presentation_url.replace('${identifier}', '_all'))
      indexData = await indexDataResponse.json()
    }

    if (!forms[context.params.slide]) {
      forms[context.params.slide] = html`
      <rdf-form id=${context.params.slide} ref=${(element: RdfForm) => this.form = element}
      extra-stylesheets="/scss/rdf-form.scss"
      onready=${(event) => this.data = event.detail.proxy.$}
      ondropdown-options=${(event) => {
   
        for (const presentation of indexData.presentations) {
          event.detail.options.push({
            uri: `${State.presentation['presentation:domain']?._}/${presentation.id}`,
            label: `${presentation.id} (all slides)`
          })

          for (const slide of presentation.slides) {
            event.detail.options.push({
              uri: `${State.presentation['presentation:domain']?._}/${presentation.id}/${slide}`,
              label: `- ${presentation.id}: ${slide}` 
            })  
          }

        }
      }}
      onfieldchange=${(event) => {
        let index
        for (const [slideIndex, slide] of State.presentation['presentation:slides'].entries()) {
          if (lastPart(slide['@id']) === context.params.slide) index = slideIndex
        }

        State.presentation['presentation:slides'][index] = this.data
        app.render()
      }}
      data=${JSON.stringify(this.data)}
      class="form" form=${referenceFormUri} />
      `
    }
    
    return html.for(textToObject(context.params.slide))`
      <div class="slide-form">        
        ${forms[context.params.slide]}
      </div>

      <div class="preview">
        <div class="preview-inner">
          ${preview}
        </div>
      </div>
    `
  }
} as { [key: string]: any }
