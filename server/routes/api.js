/* eslint-disable */
import { controller, get, post, log, required } from '../decorator/router'
import mongoose from 'mongoose'
import qiniu from '../libs/qiniu'
import sms from '../libs/sms'
import { dayTimeStr , getXingzuo} from '../wechat-lib/util'

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

  @post('logout')
  async logout(ctx, next) {

  }

  @post('auto_signin')
  async auto_signin(ctx, next) {
    var openid = ctx.request.body.openid
    const findUser = await User.findOne({unionid: openid,}).exec()

    if (findUser) {
      ctx.session.user = findUser
  
      return (ctx.body = {
        success: true,
        data:{findUser}
      })
    } else {
      return (ctx.body = {
        success: false
      })
    }
  }

  @post('signin')
  async signin(ctx, next) {
    const tel = ctx.request.body.tel
    const smscode = ctx.request.body.smscode
    // var todayDate = dayTimeStr(Date())
    const res = await SmsCode.findOne({tel: tel,}).exec()
    if (res == null || res.secode !== smscode) {
      return (ctx.body = {success:false, msg: '验证码错误'})
    } else if ((new Date().getTime() - res.meta.updateAt.getTime())/1000 > res.expiresIn) {
      return (ctx.body = {success:false, msg: '验证码过期'})
    }

    const findUser = await User.findOne({phoneNumber: tel}).exec()
    if (findUser) {
      return (ctx.body = {success:false, msg: '用户已存在'})
    }

    var openid = ctx.request.body.openid
    var unionid = ctx.request.body.openid
    var nickname = ctx.request.body.nickname
    var phoneNumber = tel
    var wxcode = ctx.request.body.wxcode
    var gender = ctx.request.body.gender
    var degree = ctx.request.body.degree
    var birthday = ctx.request.body.birthday
    var city = ctx.request.body.city
    var yy,mm,dd;
    [yy ,mm,dd] = birthday.split('-')
    var xingzuo = getXingzuo(mm, dd)
    var hometown = ctx.request.body.hometown
    var career = ctx.request.body.career
    var income = ctx.request.body.income
    var jobType = ctx.request.body.jobType
    var photos = ctx.request.body.photos
    var houseType = ctx.request.body.houseType
    var aboutMe = ctx.request.body.aboutMe
    var aboutOther = ctx.request.body.aboutOther

    //TODO 获取token
    var token = 'aaaa'

    var user = User({
      openid:[openid],
      unionid,
      role:'user',
      nickname,
      phoneNumber,
      wxcode,
      gender,
      degree,
      birthday,
      city,
      xingzuo,
      hometown,
      career,
      income,
      jobType,
      photos,
      houseType,
      aboutMe,
      aboutOther,
      token
    })
    console.log(user)
    await user.save()

    ctx.session.user = user

    return (ctx.body = {
      success: true,
      data:{user}
    })
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

  @post('check_user/:tel')
  async check_user(ctx, next) {
    const tel = ctx.params.tel
    const res = await User.findOne({phoneNumber: tel}).exec()
    if (res) {
      return (ctx.body = {success:false, msg: '用户已存在'})
    } else {
      return (ctx.body = {success:true})
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
