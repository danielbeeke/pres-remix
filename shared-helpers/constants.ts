export const base = `https://presentation.danielbeeke.nl`
export const presentationUri = `${base}/presentation.ttl#`
export const presentationFormUri = `${base}/presentation.form.ttl`
export const slideUri = `${base}/slide.ttl#`
export const slideFormUri = `${base}/slide.form.ttl`
export const referenceFormUri = `${base}/reference.form.ttl`

export const context = {
  'presentation': presentationUri,
  'slide': slideUri
}