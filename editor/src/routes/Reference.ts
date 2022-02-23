import { html } from 'ube'
import 'rdf-form';
import { RdfForm } from 'rdf-form';
import { app } from '../App';
import { slideThumbnail } from '../helpers/slideThumbnail';
import { referenceFormUri } from '../core/constants';
import { State } from '../core/State';
import { lastPart } from '../helpers/lastPart';
import { textToObject } from '../helpers/textToObject';
import { goTo } from '../helpers/goTo';
import { slideToObject } from '../helpers/slideToObject';
import { dereferenceSlide } from '../helpers/dereferenceSlide';

const forms = {}

export const Reference = {

  async template (innerTemplates: Array<typeof html> = [], context) {
    const item = State.presentation['presentation:slides'].find(slide => lastPart(slide['@id']) === context.params.slide)
    this.data = item?.$

    if (!this.data) return goTo('/presentation')

    const slide = await dereferenceSlide(item['slide:url']?._)
    const preview = slideThumbnail(slideToObject(slide))

    if (!forms[context.params.slide]) {
      forms[context.params.slide] = html`
      <rdf-form id=${context.params.slide} ref=${(element: RdfForm) => this.form = element}
      extra-stylesheets="/scss/rdf-form.scss"
      onready=${(event) => this.data = event.detail.proxy.$}
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
