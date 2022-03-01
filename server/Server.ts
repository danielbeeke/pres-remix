import { Application } from "https://deno.land/x/oak/mod.ts"
import { exists} from "https://deno.land/std/fs/mod.ts";
import { JSONLD } from "https://taisukef.github.io/jsonld-es/JSONLD.js";
import { presentationUri, slideUri } from '../shared-helpers/constants.ts'

const app = new Application()

app.use((ctx, next) => {
  ctx.response.headers.set('Access-Control-Allow-Origin', '*')
  return next()
})

app.use(async (context) => {
  if (context.request.url.pathname === '/_all') {
    const files = Deno.readDir(`${Deno.cwd()}/${Deno.args[0]}`)
    const presentations = []
    for await (const dirEntry of files) {
      if (dirEntry.isFile && dirEntry.name.includes('.pres')) {
        const presentationText = Deno.readTextFileSync(`${Deno.cwd()}/${Deno.args[0]}/${dirEntry.name}`)
        const presentationRaw = JSON.parse(presentationText)
        const [presentation] = await JSONLD().expand(presentationRaw)
        const slides = presentation[`${presentationUri}slides`]?.map((slide: any) => slide['@id'].split('#')[1]) ?? []

        presentations.push({
          id: dirEntry.name.replace('.pres', ''),
          slides
        });
      }
    }

    context.response.body = {
      presentations
    }
  }
  else {
    if (await exists(`${Deno.cwd()}/${Deno.args[0]}/${context.request.url.pathname + '.pres'}`)) {
      await context.send({
        root: `${Deno.cwd()}/${Deno.args[0]}`,
        path: context.request.url.pathname + '.pres'
      })    
    }
  }
})

await app.listen({ 
  certFile: '../cert/localhost.crt', 
  keyFile: '../cert/localhost.key',
  port: 3002,
})
