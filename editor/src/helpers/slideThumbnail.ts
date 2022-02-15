import { Slide, SlideElement } from '../types'
import { html } from 'ube'

export const slideThumbnail = (slide: Slide) => {
  return html`
    <section ref=${(element: SlideElement) => {
      element.refresh = () => {
        const factor = element.clientWidth / 800
        element.style.setProperty('--factor', factor.toString())  
      }
    }} class=${`${slide.layout ?? ''} slide`}>
      <div class="inner">


      ${slide.image ? html`
        <div class="image-wrapper">
          <img src=${slide.image}>
        </div>
      ` : null}

      ${slide.image2 ? html`
      <div class="image2-wrapper">
        <img src=${slide.image2}>
      </div>
    ` : null}

      <div class="main">
        ${slide.subtitle ? html`
        <h2 class="sub-title">${slide.subtitle}</h2>  
        ` : null}

        ${slide.title ? html`
        <h1 class="title" ref=${element => element.innerHTML = slide.title}></h1>
        ` : null}
        
        <div class="body">${slide.body}</div>
      </div>

      </div>
    </section>
  `
}