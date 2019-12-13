/* eslint-disable */
import { controller, get, post, log, required } from '../decorator/router'
import * as wechat from '../controllers/wechat'
import config from '../config'
import reply from '../wechat/reply'
import wechatMiddle from '../wechat-lib/middleware'
// import MiniprogramMiddle from '../wechat-lib/mini-middleware'

@controller('')
export class WxController {
  @get('/wechat-hear')
  @log
  async wxHear(ctx, next) {
    const middle = wechatMiddle(config.wechat, reply)
    await middle(ctx, next)
  }

  @post('/wechat-hear')
  @log
  async wxPostHear(ctx, next) {
    const middle = wechatMiddle(config.wechat, reply)
    await middle(ctx, next)
  }

  @get('/wechat-hear-miniprogram')
  @log
  async wxHear(ctx, next) {
    const middle = wechatMiddle(config.wechat, reply)
    await middle(ctx, next)
  }

  @post('/wechat-hear-miniprogram')
  @log
  async wxPostHear(ctx, next) {
    const middle = wechatMiddle(config.wechat, reply)
    await middle(ctx, next)
  }

  @get('/wechat-signature')
  async wxSignature(ctx, next) {
    await wechat.signature(ctx, next)
  }

  @get('/wechat-redirect')
  async wxRedirect(ctx, next) {
    console.log('into redirect')
    await wechat.redirect(ctx, next)
  }

  @get('/wechat-oauth')
  async wxOAuth(ctx, next) {
    await wechat.oauth(ctx, next)
  }

  @post('/wechat-pay')
  @required({ body: ['vipType'] })
  async createOrder (ctx, next) {

    const session = ctx.session
    let userId = session.user.userId
    if (!userId) {
      return (ctx.body = {success: false, msg: '用户未登录'})
    }
    await wechat.wechatPay(ctx, next)
  }

  @post('/wechat-pay-notify')
  async payNotify (ctx, next) {
    await wechat.wechatPayNotify(ctx, next)
  }
}
