export function loadStyle(src) {
  return new Promise(function (resolve, reject) {
      if (document.querySelector(`[href="${src}"]`)) return resolve(src)
      
      let link = document.createElement('link');
      link.href = src;
      link.rel = 'stylesheet';

      link.onload = () => resolve(src);
      link.onerror = () => reject(new Error(`Style load error for ${src}`));

      document.head.append(link);
  });
}
