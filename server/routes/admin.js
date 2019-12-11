/* eslint-disable */
import { controller, get, post, required } from '../decorator/router'
import mongoose from 'mongoose'

const User = mongoose.model('User')

@controller('/admin')
export class adminController {
  @post('login')
  @required({body: ['wxcode', 'password']})
  async login(ctx, next) {
    const { wxcode, password } = ctx.request.body
    let match = false
    const user = await User.findOne({ wxcode: wxcode }).exec()

    if (user) {
      match = await user.comparePassword(password, user.password)
    }

    if (match) {
      if (user.role !== 'admin') {
        return (ctx.body = {
          success: false,
          msg: '来错地方了'
        })
      }

      ctx.session.user = {
        _id: user._id,
        wxcode: user.wxcode,
        role: user.role,
        nickname: user.nickname,
        avatarUrl: user.avatarUrl
      }

      return (ctx.body = {
        success: true,
        data: user
      })
    }

    return (ctx.body = {
      success: false,
      msg: '密码错误'
    })
  }
  @post('change_pwd')
  @required({body: ['wxcode', 'newpassword']})
  async change_pwd(ctx, next) {
    const { wxcode, oldpassword, newpassword } = ctx.request.body
    let match = false
    const user = await User.findOne({ wxcode: wxcode }).exec()

    if (!user.password) {
      match = true
    } else if (user) {
      match = await user.comparePassword(oldpassword, user.password)
    }

    if (match) {
      user.password = newpassword
      console.log(user)
      await user.save()

      return (ctx.body = {
        success: true
      })
    }
  }

  @post('logout')
  async logout(ctx, next) {
    ctx.session = null

    ctx.body = {
      success: true
    }
  }

  @get('payments')
  async getPayments(ctx, next) {
    // const data = await api.payment.fetchPayments()

    ctx.body = {
      success: true
    }
  }
}
