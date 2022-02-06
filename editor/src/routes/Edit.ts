import { html } from 'ube'
import { goTo } from '../helpers/goTo';
import { slideThumbnail } from '../helpers/slideThumbnail'
import 'rdf-form';
import { State } from '../core/State';

export const Edit = {

  thumbnails () {
    return html`
      <div class="thumbnails">
        <button class="button secondary" onclick=${() => goTo('/presentation')}>Edit presentation</button>

        ${State.presentation['presentation:slides'] ? Object.entries(State.presentation['presentation:slides']).map(([slug, slide]) => html`
          <button class="thumbnail" onclick=${() => goTo(`/slide/${slug}`)}>${slideThumbnail({
            title: slide['slide:title']?._,
            subtitle: slide['slide:subTitle']?._,
            body: slide['slide:body']?._,
            image: slide['slide:image']?._,
            layout: slide['slide:layout']?._,
          })}</button>`
        ) : null}

        <button class="button secondary" onclick=${() => goTo('/slide/create')}>Create a new slide</button>
        <button class="button primary" onclick=${() => State.save()}>Save to disk</button>
      </div>
    `
  },

  async template (innerTemplates: Array<typeof html> = [], context) {

    return html`
      <div class=${`page page-${context.path.substring(1).split('/')[0]}`}>
        ${this.thumbnails()}
        ${innerTemplates}
      </div>
    `
  }
} as { [key: string]: any }