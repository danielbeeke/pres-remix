export type Slide = {
  title?: string,
  subtitle?: string,
  body?: string,
  image?: string,
  image2?: string,
  layout: string,
  footer?: string
}

export type SlideElement = HTMLDivElement & { refresh: any }

declare global {
  var launchQueue: {
    setConsumer: any
  }
}
