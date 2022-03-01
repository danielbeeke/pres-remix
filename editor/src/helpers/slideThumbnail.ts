import { Slide, SlideElement } from '../types'
import { html } from 'ube'

export const slideThumbnail = (slide: Slide, onclick = null) => {
  return html`
    <section onclick=${onclick} ref=${(element: SlideElement) => {
      element.refresh = () => {
        const factor = element.clientWidth / 1280
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
        
        ${slide.body ? html`
        <div class="body" ref=${element => element.innerHTML = slide.body}></div>
        ` : null}

        ${slide.footer ? html`
        <div class="footer" ref=${element => element.innerHTML = slide.footer}></div>
        ` : null}

      </div>

      </div>
    </section>
  `
}