import { Slide, SlideElement } from '../types'
import { html } from 'ube'

export const slideThumbnail = (slide: Slide) => {
  return html`
    <div ref=${(element: SlideElement) => {
      element.refresh = () => {
        const factor = element.clientWidth / 800
        element.style.setProperty('--factor', factor.toString())  
      }

      setTimeout(() => element.refresh())
    }} class=${`${slide.layout ?? ''} slide`}>
      <div class="inner">
      <div class="main">
        ${slide.subtitle ? html`
        <h2 class="sub-title">${slide.subtitle}</h2>  
        ` : null}

        ${slide.title ? html`
        <h1 class="title">${slide.title}</h1>
        ` : null}
        
        <div class="body">${slide.body}</div>
      </div>
      ${slide.image ? html`
        <div class="image-wrapper">
          <img src=${slide.image}>
        </div>
      ` : null}
      </div>
    </div>
  `
}