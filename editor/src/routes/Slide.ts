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

export const Slide = {

  async template (innerTemplates: Array<typeof html> = [], context) {
    this.data = context.params.slide === 'create' ? {
      '@context': { 'slide': slideUri },
      '@type': 'slide:Slide',
    } : State.presentation['presentation:slides'].find(slide => lastPart(slide['@id']) === context.params.slide)

    if (!this.data) return goTo('/slide/create')

    const thumb = slideThumbnail({
      title: this.data?.['slide:title']?._,
      subtitle: this.data?.['slide:subTitle']?._,
      body: this.data?.['slide:body']?._,
      image: this.data?.['slide:image']?._,
      layout: this.data?.['slide:layout']?._,
    })

    return html.for(this.data)`
      <div class="slide-form">
        <h1>
          Edit slide: <em>${slideTextToTitle(this.data)}</em>
          ${context.params.slide !== 'create' ? html`
            <button onclick=${() => {
              // delete State.slides[context.params.slide]
              goTo('/presentation')
            }}>${icon('close')} Delete</button>
          ` : null}
        </h1>
        <rdf-form ref=${(element: RdfForm) => {
          this.form = element
          element.addEventListener('ready', () => {
            this.data = element?.formData?.proxy
          })
        }}
        onsubmit=${(event) => {
          const title = slideTextToTitle(event.detail.proxy)
          const slug = context.params.slide === 'create' ? slugify(title) : context.params.slide
          if (!event.detail.proxy['@id']) {
            event.detail.proxy['@id'] = `temp://${slug}`
          }

          if (context.params.slide === 'create' && State.presentation['presentation:slides'].some(slide => slide['@id'] === `${base}/${slug}`)) {
            throw new Error('Slide slug has already been taken')
          }

          State.presentation['presentation:slides'].push(event.detail.proxy)

          if (context.params.slide === 'create') {
            return goTo(`/slide/${slug}`)
          }

          app.render()
          this.form.renderer.render()
        }}
        data=${JSON.stringify(this.data)}
        class="form" form=${slideFormUri} />
      </div>

      <div class="preview">
        ${thumb}
      </div>
    `
  }
} as { [key: string]: any }