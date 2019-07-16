import * as wechat from '../api/wechat'
import config from '../config'
import {
  parse as urlParse
} from 'url'
import {
  parse as queryParse
} from 'querystring'

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

  ctx.redirect(url)
}

export async function oauth(ctx, next) {
  const url = ctx.query.url
  const urlObj = urlParse(decodeURIComponent(url))
  const params = queryParse(urlObj.query)
  const code = params.code
  const user = await wechat.getUserByCode(code)

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
