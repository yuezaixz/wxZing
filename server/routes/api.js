/* eslint-disable */
import { controller, get, post, log, required } from '../decorator/router'
import mongoose from 'mongoose'
import qiniu from '../libs/qiniu'

const User = mongoose.model('User')

@controller('/api')
export class DatabaseController {
  @get('qiniu/token')
  async qiniuToken(ctx, next) {
    let key = ctx.query.key
    let token = qiniu.uptoken(key)

    ctx.body = {
      key: key,
      token: token
    }
  }

  @get('users')
  async dbUsers(ctx, next) {
    const res = await User.find({}).exec()

    ctx.body = res
  }

  @get('users/:id')
  async dbUser(ctx, next) {
    const id = ctx.params.id
    const res = await User.findOne({_id: id}).exec()

    ctx.body = res
  }

  @get('followers')
  async followers(ctx, next) {
    let userId = ctx.query.userId
    let depth = ctx.query.depth

    const followers = await User.getFollower(userId, depth)

    ctx.body = followers
  }

  @post('login')
  @log
  @required({body: ['email', 'password']})
  async login(ctx, next) {
    const { email, password } = ctx.request.body

    try {
      var user = await User.findOne({ email: email }).exec()
      var match = null
      if (user) match = await user.comparePassword(password, user.password)
    } catch (e) {
      throw new Error(e)
    }
    if (match) {
      ctx.session.user = {
        _id: user._id,
        role: user.role,
        email: user.email,
        nickname: user.nickname,
        avatarUrl: user.avatarUrl
      }

      return (ctx.body = {
        ret: 0,
        user: {
          email: user.email,
          nickname: user.nickname,
          avatarUrl: user.avatarUrl
        },
        msg: 'ok'
      })
    }

    return (ctx.body = {
      ret: 1,
      errors: {
        err: 'USER.WRONG_PASSWORD'
      }
    })
  }

  @post('logout')
  async logout(ctx, next) {

  }
}
