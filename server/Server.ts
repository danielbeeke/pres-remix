import { Application } from "https://deno.land/x/oak/mod.ts"

const app = new Application()

app.use((ctx, next) => {
  ctx.response.headers.set('Access-Control-Allow-Origin', '*')
  return next()
})

app.use(async (context) => {
  await context.send({
    root: `${Deno.cwd()}/${Deno.args[0]}`,
    path: context.request.url.pathname + '.pres'
  })
})

await app.listen({ 
  certFile: '../cert/localhost.crt', 
  keyFile: '../cert/localhost.key',
  port: 3002,
})
