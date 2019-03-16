import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'

import { Handler } from '.'
import { DEFAULT_PATH } from '../utils'

export function registerHandler<T extends object>(
  app: Koa,
  implementation: T,
  textBodyParser: boolean = true,
  path: string = DEFAULT_PATH,
): Koa {
  if (textBodyParser) {
    app.use(bodyParser({
      enableTypes: ['text'],
    }))
  }

  const handler = new Handler<T>(implementation)
  const router = new Router()
  router.post(path, async ({request, response}: Koa.Context) => {
    response.body = await handler.handle(request.body as string)
  })
  app.use(router.routes())

  return app
}
