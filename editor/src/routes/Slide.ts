import { html } from 'ube'
import 'rdf-form';
import { RdfForm } from 'rdf-form';
import { app } from '../App';
import { slideThumbnail } from '../helpers/slideThumbnail';
import { slideFormUri } from '../../../shared-helpers/constants';
import { State } from '../core/State';
import { lastPart } from '../../../shared-helpers/lastPart';
import { goTo } from '../helpers/goTo';
import { dereferenceCache } from '../core/State';
import { textToObject } from '../helpers/textToObject';
import { slideToObject } from '../../../shared-helpers/slideToObject';

const forms = {}

export const Slide = {

  async template (innerTemplates: Array<typeof html> = [], context) {
    const item = State.presentation['presentation:slides'].find(slide => lastPart(slide['@id']) === context.params.slide)
    this.data = item?.$

    if (!this.data) return goTo('/presentation')

    const preview = slideThumbnail(slideToObject(item))

    if (!forms[context.params.slide]) {
      forms[context.params.slide] = html`
      <rdf-form id=${context.params.slide} ref=${(element: RdfForm) => {
        this.form = element
        let env = dereferenceCache.get(State.presentation['presentation:domain']?._)

        element.addEventListener('dropdown-options', (event) => {
          if (env?.templates) {
            (event as CustomEvent).detail.element.options = [{
              label: 'Pick a layout',
              uri: '',
              jsonldKey: 'value'
            }, ...env.templates.map(item => ({
              label: item.label,
              uri: item.value,
              jsonldKey: 'value'
            }))]
          }
        })
      }}
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
      class="form" form=${slideFormUri} />
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
