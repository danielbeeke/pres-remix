export type Slide = {
  title?: string,
  subtitle?: string,
  body?: string,
  image?: string,
  layout: string
}

export type SlideElement = HTMLDivElement & { refresh: any }

declare global {
  var launchQueue: {
    setConsumer: any
  }
}
