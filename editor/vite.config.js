import fs from 'fs'

export default {
  server: {
    https: {
      key: fs.readFileSync('./cert/localhost.key'),
      cert: fs.readFileSync('./cert/localhost.crt'),
    }
  }
}
