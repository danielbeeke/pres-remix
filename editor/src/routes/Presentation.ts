import { html } from 'ube'
import { State } from '../core/State';
import 'rdf-form';
import { presentationFormUri, presentationUri } from '../../../shared-helpers/constants';
import { app } from '../App';
import { textToObject } from '../helpers/textToObject';

export const Presentation = {

  async template (innerTemplates: Array<typeof html> = [], context) {
    return html.for(textToObject(State.presentation['@id']))`
      <div class="presentation-form">
        <rdf-form onfieldchange=${(event: CustomEvent) => {
          Object.assign(State.presentation, event.detail.proxy)
        }}
        extra-stylesheets="/scss/rdf-form.scss"
        data=${JSON.stringify(State.presentation)}
        class="form" form=${presentationFormUri} />
      </div>
    `
  },

} as { [key: string]: any }