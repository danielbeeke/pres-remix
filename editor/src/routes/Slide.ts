import { html } from 'ube'
import 'rdf-form';
import { RdfForm } from 'rdf-form';
import { app } from '../App';
import { slideThumbnail } from '../helpers/slideThumbnail';
import { slideUri, slideFormUri, base } from '../core/constants';
import { State } from '../core/State';
import slugify from '../helpers/slugify'
import { lastPart } from '../helpers/lastPart';
import { goTo } from '../helpers/goTo';
import { slideTextToTitle } from '../helpers/slideTextToTitle';
import { icon } from '../helpers/icon'
import { dereferenceCache } from '../core/State';
import { hash } from '../helpers/hash';
import { textToObject } from '../helpers/textToObject';

const forms = {}

export const Slide = {

  async template (innerTemplates: Array<typeof html> = [], context) {
    const item = State.presentation['presentation:slides'].find(slide => lastPart(slide['@id']) === context.params.slide)

    this.data = context.params.slide === 'create' ? {
      '@context': { 'slide': slideUri },
      '@type': 'slide:Slide',
    } : item?.$

    if (!this.data) return goTo('/slide/create')

    const preview = slideThumbnail({
      title: item?.['slide:title']?._,
      subtitle: item?.['slide:subTitle']?._,
      body: item?.['slide:body']?._,
      image: item?.['slide:image']?._,
      image2: item?.['slide:image2']?._,
      footer: item?.['slide:footer']?._,
      layout: item?.['slide:layout']?._,
    })

    if (!forms[context.params.slide]) {
      forms[context.params.slide] = html`
      
      <rdf-form id=${context.params.slide} ref=${(element: RdfForm) => {
        this.form = element
        let env = dereferenceCache.get(State.presentation['presentation:domain']?._)

        element.addEventListener('dropdown-options', (event) => {
          if (env?.templates) {
            (event as CustomEvent).detail.element.options = env.templates.map(item => ({
              label: item.label,
              uri: item.value,
              jsonldKey: 'value'
            }))
          }
        }, { once: true })

        element.addEventListener('ready', () => {
          if (context.params.slide === 'create') this.data = element?.formData?.proxy.$
        }, { once: true })
      }}
      extra-stylesheets="/scss/rdf-form.scss"
      onready=${(event) => {
        this.data = event.detail.proxy.$
      }}
      onfieldchange=${(event) => {
        const slug = context.params.slide === 'create' ? hash((new Date()).getTime()) : context.params.slide
        if (!this.data?.['@id'] && this.data) this.data['@id'] = `temp://${slug}`

        if (context.params.slide === 'create' && State.presentation['presentation:slides'].find(slide => slide['@id'] === `${base}/${slug}`)) {
          throw new Error('Slide slug has already been taken')
        }

        if (context.params.slide === 'create') {
          State.presentation['presentation:slides'].push(this.data)
          return goTo(`/slide/${slug}`)
        }
        else {
          let index
          for (const [slideIndex, slide] of State.presentation['presentation:slides'].entries()) {
            if (lastPart(slide['@id']) === context.params.slide) index = slideIndex
          }

          State.presentation['presentation:slides'][index] = this.data
        }

        app.render()
        // this?.form?.renderer?.render()
      }}
      data=${JSON.stringify(this.data)}
      class="form" form=${slideFormUri} />
      `
    }
    
    return html.for(textToObject(context.params.slide))`
      <div class="slide-form">
        <h1 class="title">
          Edit slide: <em>${slideTextToTitle(this.data)?.replace(/<[^>]*>?/gm, ' ')}</em>
          ${context.params.slide !== 'create' ? html`
            <button class="button secondary" onclick=${() => {
              const item = State.presentation['presentation:slides']
              .find(slide => lastPart(slide['@id']) === context.params.slide)
              const index = State.presentation['presentation:slides'].indexOf(item)

              State.presentation['presentation:slides'].splice(index, 1)

              goTo('/presentation')
            }}>${icon('close')}</button>
          ` : null}
        </h1>
        
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
