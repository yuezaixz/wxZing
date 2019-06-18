/* eslint-disable */
import { controller, get, post, log, required } from '../decorator/router'
import mongoose from 'mongoose'
import qiniu from '../libs/qiniu'
import sms from '../libs/sms'
import { dayTimeStr} from '../wechat-lib/util'

const User = mongoose.model('User')
const SmsCode = mongoose.model('SmsCode')

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

  @post('smscode/:tel')
  async sendSmscode(ctx, next) {
    const tel = ctx.params.tel
    const ip = ctx.ip.replace('::ffff:','')
    var todayDate = dayTimeStr(new Date())
    const res = await SmsCode.findOne({tel: tel,}).exec()

    if (res) {
      // 如果发送不到60秒，直接提示过于频繁
      if (new Date().getTime() - res.meta.updateAt.getTime() < 60000) {
        ctx.body = {success:false, msg:'发送过于频繁'}
      } else if (res.sendCount >= 10) {
        ctx.body = {success:false, msg:'发送次数超过限制'}
      } else {// 如果超过60秒，重新发送二维码
        var secode = await sms.sendSmsCode(tel)
        //保存二维码，更新发送次数
        res.sendCount += 1
        res.secode = secode
        res.recordDate = todayDate
        res.meta.updateAt = new Date()
        await res.save()

        ctx.body = {success:true}
      }

    } else {
      var secode = await sms.sendSmsCode(tel)
      //保存二维码，更新发送次数
      var smsCode = SmsCode({
        tel:tel,
        secode:secode,
        ip:ip,
        recordDate:todayDate,
        sendCount:1,
        // expiresIn:300
        expiresIn:3000000
      })
      smsCode.save()
      ctx.body = {success:true}
    }
    
  }

  @post('check_smscode')
  async checkSmsCode(ctx, next) {
    const tel = ctx.request.body.tel
    const smscode = ctx.request.body.smscode
    // var todayDate = dayTimeStr(Date())
    const res = await SmsCode.findOne({tel: tel,}).exec()
    console.log(res)
    if (res == null || res.secode !== smscode) {
      ctx.body = {success:false, msg: '验证码错误'}
    } else if ((new Date().getTime() - res.meta.updateAt.getTime())/1000 > res.expiresIn) {
      ctx.body = {success:false, msg: '验证码过期'}
    } else {
      ctx.body = {success:true}
    }
  }

}
