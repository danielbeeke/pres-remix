export const slideToHtml = (slide: any) => `
  <section id=${slide.id} class="${`${slide.layout ?? ''} slide`}">
    <div class="inner">
    ${slide.image ? `
    <div class="image-wrapper">
      <img src=${slide.image}>
    </div>` : ''}

    ${slide.image2 ? `
    <div class="image2-wrapper">
      <img src=${slide.image2}>
    </div>` : ''}


      <div class="main">
        ${slide.subtitle ? `<h2 class="sub-title">${slide.subtitle}</h2>` : ''}
        ${slide.title ? `<h1 class="title">${slide.title}</h1>` : ''}
        ${slide.body ? `<div class="body">${slide.body}</div>` : ''}
        ${slide.footer ? `<div class="footer">${slide.footer}</div>` : ''}
      </div>
      <div class="main-background"></div>
    </div>
  </section>
`
