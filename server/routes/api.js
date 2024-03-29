/* eslint-disable */
import { controller, get, post, log, required } from '../decorator/router'
import mongoose from 'mongoose'
import qiniu from '../libs/qiniu'
import sms from '../libs/sms'
import { dayTimeStr , getXingzuo} from '../wechat-lib/util'

const User = mongoose.model('User')
const Zing = mongoose.model('Zing')
const Report = mongoose.model('Report')
const Black = mongoose.model('Black')
const SharedClick = mongoose.model('SharedClick')
const Lookfor = mongoose.model('Lookfor')
const SmsCode = mongoose.model('SmsCode')
const Activity = mongoose.model('Activity')
const ActivityApply = mongoose.model('ActivityApply')
const Interest = mongoose.model('Interest')
const Browse = mongoose.model('Browse')

const FULL_NUM = 100

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

  @get('users/last9')
  async last9User(ctx, next) {
    const session = ctx.session
    let userId = session.user.userId
    const lovers = await Zing.find({userId}).sort('-updateAt').exec()
    let execludeUserIds = lovers!=null?lovers.map((item)=>item.targetId):[]
    execludeUserIds.push(userId)
    let users = await User.find({'userId': {$nin:execludeUserIds}, 'wxcode': {$ne:null}, 'phoneNumber': {$ne:null},}).limit(9).exec()
    for (var k = 0; k < users.length; k++) {
      let userItem = users[k]
      let zing = Zing({userId, targetId: userItem.userId})
      await zing.save()
    }
    return (ctx.body = {
      success: true,
      data: users
    })
  }

  @get('users/:id')
  async dbUser(ctx, next) {
    const id = ctx.params.id
    const res = await User.findOne({'userId': id}).exec()

    let applys = await ActivityApply.find({'userId': id, isCancel: false})
        .populate({
          path: 'activity',
          select: '_id activityId activityName isOver'
        }).sort('-createAt').exec()
    for (var k = 0; k < applys.length; k++) {
      let applyItem = applys[k]
      if (!applyItem.activity.isOver) {
        res.apply = applyItem
        break
      }
    }
    
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

  @get('userlist/zing')
  async zing_user_list(ctx, next) {
    const session = ctx.session
    let userId = session.user.userId
    // const lovers = await Zing.find({}).sort('-updateAt').exec()
    const lovers = await Zing.find({targetId: userId}).sort('-updateAt').exec()
    let loverGroups = []

    let lastItemDateStr
    for (var i = 0; i < lovers.length; i++) {
      let lover = lovers[i]
      let userItem = await User.findOne({userId: lover.userId}).exec()
      if (!userItem) {
        continue
      }
      
      const year = lover.meta.updateAt.getFullYear()
      const month = lover.meta.updateAt.getMonth()
      const day = lover.meta.updateAt.getDate()

      let dateStr = `${year}-${month}-${day}`
      if (lastItemDateStr && lastItemDateStr === dateStr) {
        loverGroups[loverGroups.length-1]['items'].push({
          year, month, day, userItem
        })
      } else {
        loverGroups.push({
          'dateStr': `${(Array(2).join(0) + day).slice(-2)}/${month}月`,
          'items': [
            {
              year, month, day, userItem
            }
          ]
        })
      }
      lastItemDateStr = dateStr
    }

    for (var i = 0; i < loverGroups.length; i++) {
      let lover = loverGroups[i]
      let repairCount = 3 - lover.items.length % 3
      if (repairCount  == 3) {
        continue
      }
      for (var j = 0; j < repairCount; j++) {
        lover.items.push({
          'year' : -1
        })
      }
    }

    //TODO 根据日期分组下
    return (ctx.body = {
      success: true,
      data: loverGroups
    })
  }

  @get('userlist/follow')
  async follow_user_list(ctx, next) {
    const session = ctx.session
    let userId = session.user.userId
    const followers = await ActivityApply.find({targetId: userId}).sort('-updateAt').exec()
    //TODO 根据日期分组下

    let loverGroups = []

    let lastItemDateStr
    for (var i = 0; i < followers.length; i++) {
      let lover = followers[i]
      let userItem = await User.findOne({userId: lover.userId}).exec()
      
      const year = lover.meta.updateAt.getFullYear()
      const month = lover.meta.updateAt.getMonth()
      const day = lover.meta.updateAt.getDate()

      let dateStr = `${year}-${month}-${day}`
      if (lastItemDateStr && lastItemDateStr === dateStr) {
        loverGroups[loverGroups.length-1]['items'].push({
          year, month, day, userItem
        })
      } else {
        loverGroups.push({
          'dateStr': `${(Array(2).join(0) + day).slice(-2)}/${month}月`,
          'items': [
            {
              year, month, day, userItem
            }
          ]
        })
      }
      lastItemDateStr = dateStr
    }

    for (var i = 0; i < loverGroups.length; i++) {
      let lover = loverGroups[i]
      let repairCount = 3 - lover.items.length % 3
      if (repairCount  == 3) {
        continue
      }
      for (var j = 0; j < repairCount; j++) {
        lover.items.push({
          'year' : -1
        })
      }
    }

    return (ctx.body = {
      success: true,
      data: followers
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
    if (!userId) {
      return (ctx.body = {
        success: false,
        msg: '未登录'
      })
    }
    const currentActivity = await Activity.findOne({isOver: false}).sort('-createAt').exec()
    const check = await ActivityApply.findOne({activity: currentActivity, userId: userId, isCancel:false }).exec()

    return (ctx.body = {
      success: true,
      data: check
    })
  }

  @get('users')
  async users(ctx, next) {
    const session = ctx.session
    
    if (session.user.role != 'admin' && session.user.role != 'superadmin') {
      return (ctx.body = {
        success: false,
        msg: '没有权限进行该操作'
      })
    }
    let {page, limit, wxcode, age, nickname} = ctx.query
    page = Math.max(parseInt(page), 1)
    limit = Math.max(parseInt(limit), 0)
    var condition = {}
    if (wxcode && wxcode.length > 0) {
      condition['wxcode'] = wxcode
    }
    var re = /^[0-9]+.?[0-9]*/
    if (age && age.length > 0 && re.test(age)) {
      condition['age'] = {$gte: parseInt(age)}
    }
    if (nickname && nickname.length > 0) {
      condition['nickname'] = { $regex: '.*' + nickname + '.*' }
    }
    let count = await User.count(condition).exec()
    const data = await User.find(condition).sort('-createAt').skip((page-1)*limit).limit(limit).exec()

    return (ctx.body = {
      success: true,
      data,
      count
    })
  }

  @get('user_fellows_by_user_id')
  async user_fellows_by_user_id(ctx, next) {
    const session = ctx.session
    
    if (session.user.role != 'admin' && session.user.role != 'superadmin') {
      return (ctx.body = {
        success: false,
        msg: '没有权限进行该操作'
      })
    }
    let {user_id, page, limit} = ctx.query
    page = Math.max(parseInt(page), 1)
    limit = Math.max(parseInt(limit), 0)

    const currentActivity = await Activity.findOne({isOver: false}).sort('-createAt').exec()

    let activitApplys = await ActivityApply.find({fellowUserId: user_id, isCancel: false, activity: currentActivity})
      .sort('-createAt').exec()
    let fellowUserIds = activitApplys.map((item=>item.userId))

    let count = await User.count({userId: {$in: fellowUserIds}}).exec()
    const data = await User.find({userId: {$in: fellowUserIds}}).sort('-createAt').skip((page-1)*limit).limit(limit).exec()

    return (ctx.body = {
      success: true,
      data,
      count
    })
  }

  @get('user_by_activity_id')
  async user_by_activity_id(ctx, next) {
    const session = ctx.session
    
    if (session.user.role != 'admin' && session.user.role != 'superadmin') {
      return (ctx.body = {
        success: false,
        msg: '没有权限进行该操作'
      })
    }
    let {activityId, page, limit} = ctx.query
    page = Math.max(parseInt(page), 1)
    limit = Math.max(parseInt(limit), 0)

    const currentActivity = await Activity.findOne({activityId: activityId}).exec()

    let activitApplys = await ActivityApply.find({isCancel: false, activity: currentActivity})
      .sort('-createAt').exec()
    let fellowUserIds = activitApplys.map((item=>item.userId))

    let users = await User.find({userId: {$in: fellowUserIds}}).exec()
    let count = users.length
    let maleCount = users.filter((item)=>item.gender==1).length
    let femaleCount = users.filter((item)=>item.gender==2).length

    let more20Count = users.filter((item)=>item.age >= 20).length
    let more25Count = users.filter((item)=>item.age >= 25).length
    let more30Count = users.filter((item)=>item.age >= 30).length
    let more35Count = users.filter((item)=>item.age >= 35).length

    const data = await User.find({userId: {$in: fellowUserIds}}).sort('-createAt').skip((page-1)*limit).limit(limit).exec()

    return (ctx.body = {
      success: true,
      data,
      count,
      stat: {
        maleCount, femaleCount, more20Count, more25Count, more30Count, more35Count
      }
    })
  }

  @get('interests')
  async query_interests(ctx, next) {
    const data = await Interest.find({}).exec()

    return (ctx.body = {
      success: true,
      data
    })
  }

  @get('interest/:interestId')
  async query_interest(ctx, next) {
    const session = ctx.session
    let userId = session.user.userId
    
    if (session.user.role != 'admin' && session.user.role != 'superadmin') {
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
    
    if (session.user.role != 'admin' && session.user.role != 'superadmin') {
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

  @get('activityings')
  async query_activityings(ctx, next) {
    const session = ctx.session
    let userId = session.user.userId

    let activitApplys = await ActivityApply.find({userId, isCancel: false})
      .populate({
        path: 'activity',
        select: '_id activityId activityName isOver'
      }).sort('-createAt').exec()
    for (const activitIndex in activitApplys) {
      let activitApply = activitApplys[activitIndex]
      if (!activitApply.activity.isOver) {
        return (ctx.body = {
          success: false,
          code: 106,
          msg: '已报名活动',
          data: {activityId:activitApply.activityApplyId, activityName: activitApply.activity.activityName}
        })
      }
    }

    const data = await Activity.find({isOver: false}).exec()
    let isFull = false
    let isShare = false
    if (data && data.length > 0) {
      const activityApplyResults = await ActivityApply.find({activity: data[0], isCancel:false}).exec()
      isFull = activityApplyResults > FULL_NUM
      let count = await SharedClick.count({activityId: data[0].activityId}).exec()
      isShare = count >= 3
    }

    return (ctx.body = {
      success: true,
      data,
      isFull,
      isShare
    })
  }

  @get('activitys')
  async query_activitys(ctx, next) {
    const session = ctx.session
    
    if (session.user.role != 'admin' && session.user.role != 'superadmin') {
      return (ctx.body = {
        success: false,
        msg: '没有权限进行该操作'
      })
    }

    
    let {page, limit} = ctx.query
    page = Math.max(parseInt(page), 1)
    limit = Math.max(parseInt(limit), 0)
    const count = await Activity.count({}).exec()
    const data = await Activity.find({}).sort('-createAt').skip((page-1)*limit).limit(limit).exec()

    return (ctx.body = {
      success: true,
      data
    })
  }

  @get('activity/:activityId')
  async query_activity(ctx, next) {
    const session = ctx.session
    let userId = session.user.userId
    
    if (session.user.role != 'admin' && session.user.role != 'superadmin') {
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
  @post('over_activity')
  @required({body: ['activityId']})
  async over_activity(ctx, next) {
    const session = ctx.session
    
    if (session.user.role != 'admin' && session.user.role != 'superadmin') {
      return (ctx.body = {
        success: false,
        msg: '没有权限进行该操作'
      })
    }
    const { activityId } = ctx.request.body

    if (!activityId) {
      return (ctx.body = {
        success: false,
        msg: '缺少参数activityId'
      })
    }
    try {
      await Activity.updateMany({activityId}, {isOver: true})
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

  @post('activity')
  @required({body: ['activityName', 'memo', 'interestId']})
  async create_activity(ctx, next) {
    const session = ctx.session
    let userId = session.user.userId
    
    if (session.user.role != 'admin' && session.user.role != 'superadmin') {
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
      await Activity.updateMany({}, {isOver: true})
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

  @post('activity/apply_cancel')
  @required({body: ['activityId']})
  async cancel_activity(ctx, next) {
    const session = ctx.session
    let userId = session.user.userId
    const { activityId } = ctx.request.body

    const activityApply = await ActivityApply.findOne({activityApplyId:activityId}).exec()

    if (!activityApply) {
      return (ctx.body = {
        success: false,
        msg: '找不到相应报名'
      })
    }

    activityApply.isCancel = true

    try {
      await activityApply.save()
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

  @get('activity_apply/:activityApplyId')
  async queryActivityApplyById(ctx, next) {
    const activityApplyId = ctx.params.activityApplyId
    const activityApply = await ActivityApply.findOne({activityApplyId:activityApplyId}).exec()

    if (!activityApply) {
      return (ctx.body = {
        success: false,
        msg: '查找出错'
      })
    }
    const fellowUser = await User.findOne({userId: activityApply.fellowUserId}).exec()
    return (ctx.body = {
      success: true,
      data: activityApply,
      fellowUser: fellowUser
    })
  }

  @post('activity/apply')
  @required({body: ['activityId']})
  async apply_activity(ctx, next) {
    const session = ctx.session
    let userId = session.user.userId
    const { activityId, fellowUserId } = ctx.request.body

    const activity = await Activity.findOne({activityId}).exec()
    if (!activity) {
      return (ctx.body = {
        success: false,
        msg: '找不到相应群聊'
      })
    }

    const check = await ActivityApply.findOne({activity, userId, isCancel:false }).exec()
    if (check) {
      return (ctx.body = {
        success: true,
        data: check
      })
    }

    var isUserFree = false
    let oldUser = await User.findOne({'userId': userId}).exec()
    const activityApplyResults = await ActivityApply.find({activity, isCancel:false}).exec()
    if (!oldUser.isUseFress) {
      oldUser.isUseFress = true
      isUserFree = true
      oldUser = await oldUser.save()
    // } else if (activityApplyResults && activityApplyResults.length > FULL_NUM) {//测试时候把100调小
    } else if (!session.user.isVip && activityApplyResults && activityApplyResults.length > FULL_NUM) {//测试时候把100调小
      let count = await SharedClick.count({activityId: activityId}).exec()
      if (count < 3) {
        return (ctx.body = {
          success: false,
          code: 509,
          msg: '人数已满'
        })
      }
    }

    var activityApply = new ActivityApply({activity, userId, isCancel: false})
    if (fellowUserId) {
      activityApply.fellowUserId = fellowUserId
    }
    try {
      activityApply = await activityApply.save()
      return (ctx.body = {
        success: true,
        isUserFree: isUserFree,
        data: activityApply
      })
    } catch (e) {
      return (ctx.body = {
        success: false,
        msg: '保存出错',
        code: 501
      })
    }
  }

  @post('logout')
  async logout(ctx, next) {

  }

  @post('zing/random')
  async random_zing(ctx, next) {
    const session = ctx.session
    let userId = session.user ? session.user.userId : null
    let {execludeUserIds} = ctx.request.body
    // if (!userId) {
    //   return (ctx.body = {
    //     success: false,
    //     msg: '未登录'
    //   })
    // }
    let userQueryDict = {}
    if (session.user && session.user.filterGender) {
      let filterGender = session.user.filterGender
      if (filterGender == 3) {
        filterGender = [0, 2, 1][session.user.gender]
      }
      if (filterGender) {
        userQueryDict['gender'] = filterGender
      }
    }
    if (session.user && session.user.filterDegree) {
      userQueryDict['degree'] = session.user.filterDegree
    }
    if (session.user && session.user.filterHeight) {
      userQueryDict['height'] = {$gte:session.user.filterHeight}
    }
    if (userId) {

      // let browses = await Browse.find({userId: userId, 'liveUntil': {$gte: Date.now() - 86400000*5}}).sort('liveUntil').exec()
      let browses = await Browse.find({userId: userId}).sort('liveUntil').exec()
      execludeUserIds = browses?browses.map((item)=>item.targetId):[]
      execludeUserIds.push(userId)
      // if (!execludeUserIds || execludeUserIds == 0) {
      //   execludeUserIds = [userId]
      // } else {
      //   execludeUserIds.push(userId)
      // }
    }
    if (!execludeUserIds) {
      execludeUserIds = []
    }
    // if (execludeUserIds && execludeUserIds.length > 0) {
    //   userQueryDict['userId'] = {$nin:execludeUserIds}
    // }
    userQueryDict['wxcode'] = {$ne: null}
    userQueryDict['phoneNumber'] = {$ne: null}
    var users = await User.find({...userQueryDict, 'userId':{$nin:execludeUserIds}}).exec()

    if (session.user && session.user.filterAge) {
      var compareAge = [0, 20, 25, 30, 35][session.user.filterAge]
      users = users.filter((item)=>item.age > compareAge)
    }
    if (users) {
      users = users.filter((item)=>item.photos && item.photos.length > 0)
    }
    var isOldUser = false
    console.log(users.length)
    console.log(execludeUserIds)
    console.log(1111)
    if ((!users || users.length == 0) && execludeUserIds.length > 1) {
      let oldUser = await User.findOne({'userId': execludeUserIds[0]}).exec()
      users = [oldUser]
      isOldUser = true
      Browse.find({userId}).remove().exec()
    }
    const currentActivity = await Activity.findOne({isOver: false}).sort('-createAt').exec()
    var isExit = false
    for (var k = 0; k < users.length; k++) {
      let userItem = users[k]
      userItem.isApply = false
      const check = await ActivityApply.findOne({activity: currentActivity, userId: userItem.userId, isCancel:false }).exec()
      if (check) {
        userItem.isApply = true
        isExit = true
      }
    }
    if (isExit) {
      users = users.filter((item)=>item.isApply)
    }
    
    let user = users ? users[parseInt(Math.random()*users.length)]:null

    var browse = Browse({
      userId: userId,
      targetId: user.userId
    })
    browse.liveUntil = Date.now()
    browse.save()
    // if (!isOldUser && user) {
    //   var browse = Browse({
    //     userId: userId,
    //     targetId: user.userId
    //   })
    //   browse.save()
    // } else {
    //   var browse = await Browse.findOne({
    //     userId: userId,
    //     targetId: user.userId
    //   }).exec()
    //   browse.liveUntil = Date.now()
    //   browse.save()
    // }
    if (user) {
      return (ctx.body = {
        success: true,
        data: user
      })
    } else {
      return (ctx.body = {
        success: false,
        msg: '无符合条件用户'
      })
    }
  }

  @post('change_user')
  async change_user(ctx, next) {
    let {
      unionid,
      nickname,
      phoneNumber,
      wxcode,
      gender,
      degree,
      height,
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
      filterGender,
      filterHeight,
      filterDegree,
      filterAge,
    } = ctx.request.body
    if (unionid) {
      const findUser = await User.findOne({unionid: unionid,}).exec()
      if (findUser) {
        findUser.nickname = nickname
        findUser.phoneNumber = phoneNumber
        findUser.wxcode = wxcode
        findUser.gender = gender
        findUser.degree = degree
        findUser.height = height
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
        findUser.filterGender = filterGender
        findUser.filterDegree = filterDegree
        findUser.filterHeight = filterHeight
        findUser.filterAge = filterAge
        findUser.save()
        ctx.session = {
          openid: findUser.unionid,
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
    var filterGender = ctx.request.body.filterGender
    var filterDegree = ctx.request.body.filterDegree
    var filterHeight = ctx.request.body.filterHeight

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
      token,
      filterHeight,
      filterDegree,
      filterGender
    })
    console.log(user)
    await user.save()

    ctx.session.user = user

    return (ctx.body = {
      success: true,
      data:{user}
    })
  }

  @post('clickShared/:sharedId')
  async clickShared(ctx, next) {
    const sharedId = ctx.params.sharedId
    const session = ctx.session
    let userId = session.user.userId
    if (userId === sharedId) {
      ctx.body = {success:false, msg:'自己点击，不记录'}
    } else {
      const data = await Activity.findOne({isOver: false}).sort('-createAt').exec()
      if (data) {
        var sharedClick = SharedClick({
          clickUserId: userId,
          sharedUserId: sharedId,
          activityId: data.activityId
        })
        sharedClick.save()
      }
    }
    ctx.body = {success:true}
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

  @get('user/auto_login/:openid')
  async auto_login_by_openid(ctx, next) {
    console.log('auto_login_by_openid')
    const openid = ctx.params.openid
    const res = await User.findOne({unionid: openid}).exec()
    if (!res) {
      ctx.session.user = res
      return (ctx.body = {success:false, msg: '用户不存在'})
    } else {
      return (ctx.body = {success:true, data:res})
    }
  }

  @get('user/:userId')
  async query_user_by_id(ctx, next) {
    const session = ctx.session
    if (!session.user) {
      return (ctx.body = {success:false, msg: '未登录'})
    }

    const userId = ctx.params.userId
    const res = await User.findOne({userId: userId}).exec()

    let applys = await ActivityApply.find({userId})
        .populate({
          path: 'activity',
          select: '_id activityId activityName isOver'
        }).sort('-createAt').exec()
    let apply = null
    for (var k = 0; k < applys.length; k++) {
      let applyItem = applys[k]
      if (!applyItem.activity.isOver) {
        apply = applyItem
        break
      }
    }

    const loverCount = await Zing.count({targetId: userId}).exec()
    const isLoved = (await Zing.count({targetId: userId, userId: session.user.userId }).exec()) > 0

    if (!res) {
      return (ctx.body = {success:false, msg: '用户不存在'})
    } else {
      return (ctx.body = {success:true, data:res, apply, loverCount, isLoved})
    }
  }


  @post('vip/test7day')
  async test7day(ctx, next) {
    const session = ctx.session
    let userId = session.user.userId
    const findUser = await User.findOne({userId: userId,}).exec()
    findUser.incVipTime(604800*1000)
    return (ctx.body = {success:true, data:findUser})
  }
  

  @post('fellow/user')
  async fellowUser(ctx, next) {
    var targetId = ctx.request.body.fellowUserId
    const session = ctx.session
    let userId = session.user.userId
    let lookfor;
    lookfor = await Lookfor.findOne({userId, targetId}).exec()
    if (!lookfor) {
      lookfor = Lookfor({userId, targetId})
    } else {
      lookfor.lookforCount += 1
    }
    lookfor = await lookfor.save()

    if (!session.user.isVip) {
    // if (false) { // 暂时不验证VIP
      return (ctx.body = {
        success:false,
        code: 101, 
        data: lookfor,
        msg: '无权限'
      })
    } else {
      let applys = await ActivityApply.find({'userId': targetId, isCancel: false})
        .populate({
          path: 'activity',
          select: '_id isOver'
        }).sort('-createAt').exec()
      let apply = null
      for (var k = 0; k < applys.length; k++) {
        let applyItem = applys[k]
        if (!applyItem.activity.isOver) {
          apply = applyItem
          break
        }
      }

      if (apply) {
        let newApply = await ActivityApply.findOne({userId, 'activity': apply.activity._id})
          .populate({
            path: 'activity',
            select: '_id isOver activityName'
          }).exec()
        if (!newApply) {
          newApply = new ActivityApply({'activity': apply.activity, userId, isCancel: false})
          newApply = await newApply.save()
        }
        return (ctx.body = {
          success: true,
          data: newApply
        })
      } else {
        return (ctx.body = {
          success:false,
          code: 105, 
          msg: '未找到群'
        })
      }

    }

  }

  @post('black/user')
  async blackUser(ctx, next) {
    var targetId = ctx.request.body.userId
    const session = ctx.session
    let userId = session.user.userId
    let black;
    black = await Black.findOne({userId, targetId}).exec()
    if (!black) {
      black = Black({userId, targetId})
      black = await black.save()
    }
    
    if (black) {
      return (ctx.body = {
        success: true,
        data: black
      })
    } else {
      return (ctx.body = {success:false, msg: '操作出错'})
    }
  }

  @post('report/user')
  async reportUser(ctx, next) {
    var targetId = ctx.request.body.userId
    const session = ctx.session
    let userId = session.user.userId
    let report;
    report = await Report.findOne({userId, targetId}).exec()
    if (!report) {
      report = Report({userId, targetId})
      report = await report.save()
    }
    
    if (report) {
      return (ctx.body = {
        success: true,
        data: report
      })
    } else {
      return (ctx.body = {success:false, msg: '操作出错'})
    }
  }

  @post('zing/deluser')
  async delZingUser(ctx, next) {
    var targetId = ctx.request.body.zingUserId
    const session = ctx.session
    let userId = session.user.userId
    let zing = await Zing.remove({userId, targetId}).exec()
    
    if (zing) {
      return (ctx.body = {
        success: true,
        data: zing
      })
    } else {
      return (ctx.body = {success:false, msg: '操作出错'})
    }
  }

  @post('zing/user')
  async zingUser(ctx, next) {
    var targetId = ctx.request.body.zingUserId
    const session = ctx.session
    let userId = session.user.userId
    let zing;
    zing = await Zing.findOne({userId, targetId}).exec()
    if (!zing) {
      zing = Zing({userId, targetId})
      zing = await zing.save()
    }
    
    if (zing) {
      return (ctx.body = {
        success: true,
        data: zing
      })
    } else {
      return (ctx.body = {success:false, msg: '操作出错'})
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
