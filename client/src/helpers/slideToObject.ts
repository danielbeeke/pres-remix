export const slideToObject = (slide) => ({
  id: slide['@id'].split('#').pop(),
  title: slide['slide:title']?._,
  subtitle: slide['slide:subTitle']?._,
  body: slide['slide:body']?._,
  image: slide['slide:image']?._,
  layout: slide['slide:layout']?._,
  footer: slide['slide:footer']?._,
  image2: slide['slide:image2']?._,
})