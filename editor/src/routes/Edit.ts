import { html } from 'ube'
import { goTo } from '../helpers/goTo';
import { slideThumbnail } from '../helpers/slideThumbnail'
import 'rdf-form';
import { State } from '../core/State';
import { lastPart } from '../helpers/lastPart';
import { icon } from '../helpers/icon';

export const Edit = {

  thumbnails (context) {
    return html`
      <div class="thumbnails">
        <div class="menu">
          <button class="button primary big" onclick=${() => State.open()}>${icon('load')}</button>
          <button class="button primary big" onclick=${() => State.save()}>${icon('save')}</button>
        </div>

        <button class="button secondary" onclick=${() => goTo('/presentation')}>Edit presentation</button>

        ${State.presentation['presentation:slides'] ? State.presentation['presentation:slides'].map((slide, index) => html`
          <div class=${`thumbnail ${context.params.slide === lastPart(slide['@id']) ? 'active' : ''}`}>
          <div class="buttons top">
            <button class="icon-button add-slide" onclick=${() => State.createSlide(index)}>${icon('plus')}</button>
            <button class="icon-button add-reference" onclick=${() => State.createReference(index)}>${icon('link')}</button>
            <button class="icon-button delete" onclick=${() => State.deleteSlide(index)}>${icon('close')}</button>
          </div>
          ${slideThumbnail({
            title: slide['slide:title']?._,
            subtitle: slide['slide:subTitle']?._,
            body: slide['slide:body']?._,
            image: slide['slide:image']?._,
            image2: slide['slide:image2']?._,
            footer: slide['slide:footer']?._,
            layout: slide['slide:layout']?._,
          }, () => goTo(`/slide/${lastPart(slide['@id'])}`))}
          <div class="buttons bottom">
          <button class="icon-button add-slide" onclick=${() => State.createSlide(index + 1)}>${icon('plus')}</button>
          <button class="icon-button add-reference" onclick=${() => State.createReference(index + 1)}>${icon('link')}</button>
        </div>
          </div>`
        ) : null}

        ${State.presentation['presentation:slides'].length === 0 ? html`
          <button class="button secondary" onclick=${() => State.createSlide(0)}>Create a new slide</button>
        ` : null}

      </div>
    `
  },

  async template (innerTemplates: Array<typeof html> = [], context) {

    return html`
      <div class=${`page page-${context.path.substring(1).split('/')[0]}`}>
        ${this.thumbnails(context)}
        ${innerTemplates}
      </div>
    `
  }
} as { [key: string]: any }