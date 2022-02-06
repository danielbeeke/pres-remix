import { html } from 'ube'
import { State } from '../core/State';
import 'rdf-form';
import { presentationFormUri, presentationUri } from '../core/constants';
import { app } from '../App';

export const Presentation = {

  async template (innerTemplates: Array<typeof html> = [], context) {
    return html`
      <div class="presentation-form">
        <h1>Edit presentation: ${State.presentation['presentation:title']?._}</h1>
        <rdf-form onsubmit=${(event: CustomEvent) => {
          State.presentation = event.detail.proxy
          app.render()
        }}
        data=${JSON.stringify(State.presentation)}
        class="form" form=${presentationFormUri} />
      </div>
    `
  },

} as { [key: string]: any }