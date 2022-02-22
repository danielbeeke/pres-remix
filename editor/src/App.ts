import { Router } from './core/Router'
import { render } from 'ube'
import { goTo } from './helpers/goTo'
import { SlideElement } from './types'
import { State } from './core/State'

class App {

  constructor () {
    window.addEventListener('render', () => this.render())
    window.addEventListener('popstate', () => this.render())
    document.body.addEventListener('click', (event: Event) => {
      const target = event.target as HTMLElement
      const link = target.nodeName === 'A' ? target : target.closest('a')
      if (!link) return

      const href = link.getAttribute('href')
      if (href && (href[0] === '/' || !href.startsWith('http'))) {
          event.preventDefault()
          goTo(href)
      }
    })

    window.addEventListener('resize', this.scaleSlides)

    if (!location.search.includes('source') && 'serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js')
    if ('launchQueue' in window) {
      window.launchQueue.setConsumer(launchParams => {
        State.load(launchParams.files[0]).then(() => this.render())
      })
    }

    this.render().then(() => app.scaleSlides())
  }

  scaleSlides () {
    const slides = document.querySelectorAll('.slide')
    for (const slide of slides) (slide as SlideElement).refresh()
  }

  async render () {
    const response = await Router.resolve({ pathname: location.pathname })

    if (response.redirect) return goTo(response.redirect)

    let pointer = null
    for (const route of response.routes.reverse()) {
      pointer = await route.template(pointer, response.context)
    }

    await render(document.body, pointer)
    this.scaleSlides()
  }
}

export const app = new App()