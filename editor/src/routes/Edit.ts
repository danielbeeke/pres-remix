import { html } from 'ube'
import { goTo } from '../helpers/goTo';
import { slideThumbnail } from '../helpers/slideThumbnail'
import 'rdf-form';
import { State } from '../core/State';
import { lastPart } from '../helpers/lastPart';
import { icon } from '../helpers/icon';
import { slideToObject } from '../helpers/slideToObject';
import { dereferenceSlide } from '../helpers/dereferenceSlide';

export const Edit = {

  async thumbnails (context) {
    return html`
      <div class="left">
        <div class="menu">
          <div class="disk">
            <button class="button primary big" onclick=${() => State.open()}>${icon('load')}</button>
            <button class="button primary big" onclick=${() => State.save()}>${icon('save')}</button>
          </div>
          <button class="button secondary" onclick=${() => goTo('/presentation')}>Edit presentation</button>
          ${State.presentation['presentation:slides'].length === 0 ? html`
            <button class="button secondary" onclick=${() => State.createSlide(0)}>Create a new slide</button>
          ` : null}  
        </div>
        
        <div class="thumbnails">

        ${State.presentation['presentation:slides'] ? await Promise.all(State.presentation['presentation:slides'].map(async (slide, index) => {
          const type = slide?.['@type']?.__?.split(':')[1].toLowerCase()

          const loadedSlide = type === 'reference' ? await dereferenceSlide(slide['slide:url']?._) : slide

          return html`
          <div class=${`thumbnail ${context.params.slide === lastPart(slide['@id']) ? 'active' : ''}`}>
            <div class="buttons top">
              <button class="icon-button add-slide" onclick=${() => State.createSlide(index)}>${icon('plus')}</button>
              <button class="icon-button add-reference" onclick=${() => State.createReference(index)}>${icon('link')}</button>
              <button class="icon-button delete" onclick=${() => State.deleteSlide(index)}>${icon('close')}</button>
            </div>
            ${slideThumbnail(slideToObject(loadedSlide), () => goTo(`/${type}/${lastPart(slide['@id'])}`))}
            <div class="buttons bottom">
              <button class="icon-button add-slide" onclick=${() => State.createSlide(index + 1)}>${icon('plus')}</button>
              <button class="icon-button add-reference" onclick=${() => State.createReference(index + 1)}>${icon('link')}</button>
            </div>
          </div>`

        })) : null}

        </div>
      </div>
    `
  },

  async template (innerTemplates: Array<typeof html> = [], context) {

    return html`
      <div class=${`page page-${context.path.substring(1).split('/')[0]}`}>
        ${await this.thumbnails(context)}
        ${innerTemplates}
      </div>
    `
  }
} as { [key: string]: any }