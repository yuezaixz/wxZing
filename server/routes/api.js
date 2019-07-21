/* eslint-disable */
import { controller, get, post, log, required } from '../decorator/router'
import mongoose from 'mongoose'
import qiniu from '../libs/qiniu'
import sms from '../libs/sms'
import { dayTimeStr , getXingzuo} from '../wechat-lib/util'

const User = mongoose.model('User')
const Zing = mongoose.model('Zing')
const Lookfor = mongoose.model('Lookfor')
const SmsCode = mongoose.model('SmsCode')
const Activity = mongoose.model('Activity')
const ActivityApply = mongoose.model('ActivityApply')
const Interest = mongoose.model('Interest')

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

  @get('lovers')
  async lovers(ctx, next) {
    const session = ctx.session
    let userId = session.user.userId
    const lovers = await Zing.find({targetId: userId}).sort('-createAt').exec()

    return (ctx.body = {
      success: true,
      count: lovers.length,
      data: lovers
    })
  }

  @get('followers')
  async followers(ctx, next) {
    const session = ctx.session
    let userId = session.user.userId
    const lookfors = await Lookfor.find({targetId: userId}).sort('-createAt').exec()

    return (ctx.body = {
      success: true,
      count: lookfors.length,
      data: lookfors
    })
  }

  @get('activity_state')
  async activity_state(ctx, next) {
    const session = ctx.session
    let userId = session.user.userId

    let activitApplys = await ActivityApply.find({userId}).sort('-createAt').exec()
    for (const activitApply in activitApplys) {
      if (!activitApply.activity.isOver) {
        return (ctx.body = {
          success: true,
          state: !activitApply ? 0 : (!activitApply.isHandle ? 2 : (activitApply.isSuccess ? 1 : 3) ) // 0未报名 1 已报名 2 审核中 3审核失败
        })
      }
    }
    return (ctx.body = {
      success: true,
      state: 0
    })
  }

  @get('interest')
  async query_interest(ctx, next) {
    const session = ctx.session
    let userId = session.user.userId
    
    if (userId != 4) {
      return (ctx.body = {
        success: false,
        msg: '没有权限进行该操作'
      })
    }

    const data = await Interest.find({}).exec()

    return (ctx.body = {
      success: true,
      data
    })
  }

  @get('interest/:interestId')
  async query_interests(ctx, next) {
    const session = ctx.session
    let userId = session.user.userId
    
    if (userId != 4) {
      return (ctx.body = {
        success: false,
        msg: '没有权限进行该操作'
      })
    }

    const { interestId } = ctx.params

    if (!interestId) {
      return (ctx.body = {
        success: false,
        msg: 'interestId不能为空'
      })
    }

    const data = await Interest.findOne({interestId}).exec()

    return (ctx.body = {
      success: true,
      data
    })
  }

  @post('interest')
  @required({body: ['name', 'aboutInterest']})
  async create_interest(ctx, next) {
    const session = ctx.session
    let userId = session.user.userId
    
    if (userId != 4) {
      return (ctx.body = {
        success: false,
        msg: '没有权限进行该操作'
      })
    }

    const { name, aboutInterest } = ctx.request.body
    var interest = new Interest({
      name,
      aboutInterest
    })
    try {
      interest = await interest.save()
      return (ctx.body = {
        success: true,
        data: interest
      })
    } catch (e) {
      return (ctx.body = {
        success: false,
        msg: '保存出错'
      })
    }
  }

  @get('activity')
  async query_activitys(ctx, next) {
    const session = ctx.session
    let userId = session.user.userId
    
    if (userId != 4) {
      return (ctx.body = {
        success: false,
        msg: '没有权限进行该操作'
      })
    }

    const data = await Activity.find({}).exec()

    return (ctx.body = {
      success: true,
      data
    })
  }

  @get('activity/:activityId')
  async query_activity(ctx, next) {
    const session = ctx.session
    let userId = session.user.userId
    
    if (userId != 4) {
      return (ctx.body = {
        success: false,
        msg: '没有权限进行该操作'
      })
    }

    const { activityId } = ctx.params

    if (!activityId) {
      return (ctx.body = {
        success: false,
        msg: 'activityId不能为空'
      })
    }

    const data = await Activity.find({activityId}).exec()

    return (ctx.body = {
      success: true,
      data
    })
  }

  @post('activity')
  @required({body: ['activityName', 'memo', 'interestId']})
  async create_activity(ctx, next) {
    const session = ctx.session
    let userId = session.user.userId
    
    if (userId != 4) {
      return (ctx.body = {
        success: false,
        msg: '没有权限进行该操作'
      })
    }
    const { activityName, memo, interestId} = ctx.request.body
    const interest = await Interest.findOne({interestId}).exec()
    if (!interest) {
      return (ctx.body = {
        success: false,
        msg: '兴趣编号找不到对应兴趣'
      })
    }
    var activity = new Activity({activityName, memo, interest})
    try {
      activity = await activity.save()
      return (ctx.body = {
        success: true,
        data: activity
      })
    } catch (e) {
      return (ctx.body = {
        success: false,
        msg: '保存出错'
      })
    }
  }

  @post('activity/over')
  @required({body: ['activityId']})
  async over_activity(ctx, next) {
    const { activityId } = ctx.request.body
    let currentActivity = await Activity.findOne({activityId}).exec()
    currentActivity.isOver = true
    try {
      await currentActivity.save()
      return (ctx.body = {
        success: true
      })
    } catch (e) {
      return (ctx.body = {
        success: false,
        msg: '保存出错'
      })
    }
  }

  @post('logout')
  async logout(ctx, next) {

  }

  @post('change_user')
  async change_user(ctx, next) {
    let {
      openid,
      nickname,
      phoneNumber,
      wxcode,
      gender,
      degree,
      birthday,
      xingzuo,
      city,
      hometown,
      career,
      income,
      jobType,
      photos,
      houseType,
      aboutMe,
      aboutOther,
    } = ctx.request.body
    if (openid) {
      const findUser = await User.findOne({unionid: openid,}).exec()
      if (findUser) {
        findUser.nickname = nickname
        findUser.phoneNumber = phoneNumber
        findUser.wxcode = wxcode
        findUser.gender = gender
        findUser.degree = degree
        findUser.birthday = birthday
        findUser.xingzuo = xingzuo
        findUser.city = city
        findUser.hometown = hometown
        findUser.career = career
        findUser.income = income
        findUser.jobType = jobType
        findUser.photos = photos
        findUser.houseType = houseType
        findUser.aboutMe = aboutMe
        findUser.aboutOther = aboutOther
        findUser.save()
        ctx.session = {
          openid: findUser.openid,
          user: findUser
        }
        return (ctx.body = {
          success: true,
          user: findUser
        })
      }
    }

    return (ctx.body = {
      success: false
    })
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
    // TODO 暂时不真的发送，直接给成功
    // return (ctx.body = {success:true})

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
      return (ctx.body = {success:false, msg: '验证码错误'})
    } else if ((new Date().getTime() - res.meta.updateAt.getTime())/1000 > res.expiresIn) {
      return (ctx.body = {success:false, msg: '验证码过期'})
    } else {
      return (ctx.body = {success:true})
    }
  }

}
