import * as wechat from '../api/wechat'
import config from '../config'
import api from '../api'
import { getParamsAsync, getNoticeAsync, getPayDataAsync, buildSuccessXML } from '../wechat-lib/pay'
import {
  parse as urlParse
} from 'url'
import {
  parse as queryParse
} from 'querystring'
import mongoose from 'mongoose'

const Payment = mongoose.model('Payment')

export async function signature(ctx, next) {
  let url = ctx.query.url

  if (!url) ctx.throw(404)

  url = decodeURIComponent(url)
  let params = await wechat.getSignatureAsync(url)
  ctx.body = {
    success: true,
    params: params
  }
}

// 网页上点某按钮，直接跳转到 http://x.o/wechat-redirect?visit=a&id=b
// 用户被重定向到 Wechat Redirect URL 授权验证
// 验证后，自动二跳进入 http://x.o/oauth?code=xxxxxx&state=a_b
export async function redirect(ctx, next) {
  let redirect = config.SITE_ROOT_URL + '/oauth'
  let scope = 'snsapi_userinfo'
  const {
    visit,
    id
  } = ctx.query
  const params = id ? `${visit}_${id}` : visit

  const url = wechat.getAuthorizeURL(scope, redirect, params)
  console.log('redirect' + url)
  ctx.redirect(url)
}

export async function oauth(ctx, next) {
  const url = ctx.query.url
  const urlObj = urlParse(decodeURIComponent(url))
  const params = queryParse(urlObj.query)
  const code = params.code
  const user = await wechat.getUserByCode(code)
  if (!user || !user.openid) {
    return (ctx.body = {
      success: false
    })
  }

  // 如果不存在该openid的用户，则添加到用户系统中。如果存在，则把附加信息加上
  const mongoose = require('mongoose')
  const User = mongoose.model('User')
  let dbUser = await User.findOne({openid: user.openid}).exec()
  if (!dbUser) {
    console.log('new user')
    dbUser = new User({
      role: 'user',
      openid: user.openid,
      unionid: user.openid,
      cityName: user.city,
      nickname: user.nickname,
      provinceName: user.province,
      country: user.country,
      gender: user.sex,
      avatarUrl: user.headimgurl,
      code: code
    })
  } else {
    console.log('update user')
    dbUser.code = code
    dbUser.openid = user.openid
    dbUser.unionid = user.openid
    dbUser.cityName = user.city
    dbUser.nickname = user.nickname
    dbUser.provinceName = user.province
    dbUser.country = user.country
    dbUser.gender = user.sex
    dbUser.avatarUrl = user.headimgurl
  }
  console.log(dbUser)
  try {
    await dbUser.save()
    dbUser = await User.findOne({openid: user.openid}).exec()
  } catch (e) {
    console.log(e, 'Save User Error')
  }

  // console.log('oauth', user)
  ctx.session = {
    openid: user.openid,
    user: dbUser
  }
  ctx.body = {
    success: true,
    user: dbUser
  }
}

export async function paymentAsync(ctx, next) {
  const { body } = ctx.request

  try {
    let payment = await Payment.findOne({
      _id: body.payment._id
    }).exec()

    if (!payment) return (ctx.body = {success: false, msg: '订单不存在'})

    if (String(payment.vipType) !== body.vipType || String(payment.user) !== body.user._id) {
      return (ctx.body = {
        success: false,
        msg: '订单错误，请联系网站管理员'
      })
    }

    payment.success = 1
    await payment.save()

    ctx.body = {success: true, msg: '支付成功'}
  } catch (err) {
    return (ctx.body = {
      success: false,
      err: err
    })
  }
}

export async function wechatPayNotify(ctx, next) {
  try {
    const data = await getPayDataAsync(ctx.req)
    const message = await getNoticeAsync(data)
    if (message.return_code === 'SUCCESS') {
      let payment = await api.payment.getPaymentByTrade(message.out_trade_no)
      if (parseInt(message.total_fee) !== parseInt(payment.totalFee)) {
        payment.success = 500
      }
      // 如果已经有notify 了，就不保存了
      if (!payment.notify) {
        payment.notify = message
        payment.success = 100
        const findUser = await api.user.fetchUserByUserId(payment.user.userId)
        findUser.incVipTime(payment.vipType * 31 * (86400) * 1000)
        payment = await api.payment.updatePayment(payment)
      }
    }
    ctx.status = 200
    ctx.type = 'application/xml'
    ctx.body = buildSuccessXML()
    return ctx.body
  } catch (e) {
    throw new Error('通知异常')
  }
}

export async function wechatPay(ctx, next) {
  const ip = ctx.ip.replace('::ffff:', '')
  const session = ctx.session
  let {
    vipType
  } = ctx.request.body
  try {
    vipType = parseInt(vipType)
    if (vipType !== 1 && vipType !== 3 && vipType !== 12) {
      return (ctx.body = {success: false, err: 'vipType输入错误'})
    }
    const price = vipType === 1 ? 6000 : (vipType === 3 ? 13800 : 41800)
    let user = await api.user.findUserByUnionId(session.user.unionid)

    if (!user) return (ctx.body = {success: false, err: '用户不存在'})
    console.log(`价格${price}`)
    const outTradeNo = 'Product_' + vipType + '_' + (+new Date())
    const orderParams = {
      body: '续费会员' + vipType,
      attach: '办公室计划会员在线支付',
      out_trade_no: outTradeNo,
      spbill_create_ip: ip,
      total_fee: price,
      // total_fee: 0.01 * 100,
      openid: session.user.unionid,
      trade_type: 'JSAPI'
    }
    console.log(orderParams)
    const order = await getParamsAsync(orderParams)
    const payment = await api.payment.create(user, vipType, price, order, outTradeNo)

    ctx.body = {
      success: true,
      data: payment.order
    }
  } catch (err) {
    console.log('error:')
    console.log(err)
    ctx.body = {
      success: false,
      err: err
    }
  }
}
