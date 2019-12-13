import Koa from 'koa'
import conf from './config'
import {
  Nuxt,
  Builder
} from 'nuxt'
import R from 'ramda'
import {
  resolve
} from 'path'

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(conf.env === 'production')

const r = path => resolve(__dirname, path)
const MIDDLEWARES = ['database', 'common', 'router']

class Server {
  constructor() {
    this.app = new Koa()
    this.useMiddlewares(this.app)(MIDDLEWARES)
  }
  useMiddlewares(app) {
    // 中间件的个数不定，通过 Ramda 的特性，从右往左进行函数组合，右侧函数的返回结果总是左侧函数的输入参数
    // R.map(console.log)([1, 2, 3])
    // MIDDLEWARE 数组交给了 R.map
    // 分别拿到的单个数组中的值，我们可以通过 R.compose 再次进行组合。
    return R.map(R.compose(
      R.map(i => i(app)),
      require,
      i => `${r('./middleware')}/${i}`))
  }

  async start() {
    // Instantiate nuxt.js
    const nuxt = new Nuxt(config)
    // Build in development
    if (config.dev) {
      const builder = new Builder(nuxt)
      await builder.build()
    }
    this.app.use(async (ctx, next) => {
      // ctx.request.socket.setTimeout(5 * 60 * 1000)
      await next()
      ctx.req.session = ctx.session
      // console.log('ctx.req.session', ctx.session)
      ctx.status = 200 // koa defaults to 404 when it sees that status is unset
      return new Promise((resolve, reject) => {
        ctx.res.on('close', resolve)
        ctx.res.on('finish', resolve)
        nuxt.render(ctx.req, ctx.res, promise => {
          // nuxt.render passes a rejected promise into callback on error.
          promise.then(resolve).catch(reject)
        })
      })
    })
    let aaserver = this.app.listen(conf.port, conf.host)
    // console.log(`aasbbcc1${aaserver.timeout}`)
    aaserver.setTimeout(25 * 60 * 1000)
    // console.log(`aasbbcc2${aaserver.timeout}`)
    console.log('Server listening on ' + conf.host + ':' + conf.port) // eslint-disable-line no-console
  }
}

const app = new Server()
app.start()
