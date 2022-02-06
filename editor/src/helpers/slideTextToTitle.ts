export const slideTextToTitle = (slide) => {
  return slide['slide:title']?._ ??
  slide['slide:subTitle']?._ ??
  slide['slide:body']?._?.substring(0, 20)
}