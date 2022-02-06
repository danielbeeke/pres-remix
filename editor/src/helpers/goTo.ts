import { html } from 'ube'

/**
 * Navigates to the new URL.
 * @param path 
 * @returns 
 */
export const goTo = (path: string) => {
  if (location.pathname !== path) history.pushState({}, '', path)
  window.dispatchEvent(new CustomEvent('render'))
  return html`The page is being redirected`
}