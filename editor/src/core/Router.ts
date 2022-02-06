import UniversalRouter from 'universal-router'
import { Edit } from '../routes/Edit'
import { Presentation } from '../routes/Presentation'
import { Slide } from '../routes/Slide'

const routes: Array<{}> = [
  {
    path: '/',
    action: (context) => ({ routes: [], context, redirect: '/presentation' }),
  },
  {
    path: '/presentation',
    action: (context) => ({ routes: [Edit, Presentation], context }),
  },
  {
    path: '/slide/:slide',
    action: (context) => ({ routes: [Edit, Slide], context }),
  }
]

export const Router = new UniversalRouter(routes)