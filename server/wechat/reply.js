// import config from '../config'
import mongoose from 'mongoose'

const User = mongoose.model('User')
const TmpMedia = mongoose.model('TmpMedia')

const tip = '你好呀小可爱，欢迎加入办公室计划，现在我们的产品还在小规模试用中，这中间可能有一些bug，如果恰巧被你发现了，请反馈给我们，我们的程序员小哥哥会尽快修复它。\n' +
   '办公室计划的初衷是为了让不同的办公室成员们以更放松与自然的方式实现恋爱，虽然我们是一款严肃的恋爱产品，但是每周都有一期好玩的主题活动，在微信群里，每天都有一些稀奇古怪的鬼主意等着你一起参与，我们不仅希望你能在这里找到另一半，最重要的是，让自己变得更加优秀，点击报名活动，开启你的一段奇妙之旅吧。\n' +
   'ps：填写资料的过程中需要每一位小可爱认真负责的填写自己的情况，如果发现资料是敷衍不真诚的，我们将封号处理，希望小可爱理解。\n' +
   'pps：资料库里的成员是每期活动的报名成员，如果你恰巧遇到心仪的人，可以申请加入同一个微信群。\n' +
   'ppps：我们目前的会员因为是小规模测试中，可能会存在bug影响体验，所以会员全部半价，正式上线后恢复原价。'
  //  '回复 1，\n' +
  //  '回复 2，\n' +
  //  '回复 3，\n' +
  //  '回复 4，\n' +
  // '或者点击 <a href="' + config.WEBSITE_ROOT_URL + '/exam">了解更多</a>'

const bt = '我的博客 <a href="http://blog.davidandty.com">点击进入</a>'

const wj = '问卷 <a href="https://uag9bh.fanqier.cn/f/68vx3b">点击进入</a>'

const telRe = /1(3|4|5|7|8)\d{9}/

export default async (ctx, next) => {
  const message = ctx.weixin
  let mp = require('../wechat')
  let client = mp.getWechat()

  if (message.MsgType === 'event') {
    if (message.Event === 'subscribe') {
      const menu = require('./menu').default
      try {
        await client.handle('delMenu')
      } catch (e) {
        console.log('删除菜单失败')
        console.log(e)
      }

      try {
        const createResult = await client.handle('createMenu', menu)
        console.log(createResult)
      } catch (err) {
        console.log('创建菜单失败')
        console.log(err)
      }
      ctx.body = tip
    } else if (message.Event === 'unsubscribe') {
      console.log('取关了')
    } else if (message.Event === 'LOCATION') {
      console.log('定位' + message.Latitude + ' : ' + message.Longitude)
      // ctx.body = message.Latitude + ' : ' + message.Longitude
    } else if (message.Event === 'view') {
      ctx.body = message.EventKey + message.MenuId
    } else if (message.Event === 'pic_sysphoto') {
      ctx.body = message.Count + ' photos sent'
    } else if (message.Event === 'CLICK') {
      if (message.EventKey === 'bt') {
        console.log(1)
        ctx.body = bt
        console.log(2)
      } else if (message.EventKey === 'kf') {
        ctx.body = [{
          title: '脑中风康复训练',
          description: '通过压力传感器，协助医生观察足部训练的受力情况，并通过评估功能来判断病患情况来使用训练功能进行康复训练',
          picUrl: 'http://mmbiz.qpic.cn/mmbiz_jpg/knCHmO7t1HPM65O26N6NSI2genC7WFmXXyGoXxnqyOz49FQ4jBpslrDUQqOgZZo8M6C8ibQcOQV1e8fknNticcQQ/0',
          url: 'https://itunes.apple.com/app/id1276483563'
        }]
      }
    } else {
      ctx.body = tip
    }
    console.log(3)
  } else if (message.MsgType === 'text') {
    if (~message.Content.indexOf('我要加入') && message.Content && message.Content.length > 4) {
      let searchTag = message.Content.substring(4)
      let tags = await client.handle('fetchTags')
      tags = tags['tags']
      tags = tags || []
      tags = tags.filter(item => item.name === searchTag)
      if (!tags || !tags.length) {
        await client.handle('createTag', searchTag)
      }
      await client.handle('batchTag', [message.FromUserName], tags[0].id)
      ctx.body = '加入成功'
    } else if ((~message.Content.indexOf('上市') || ~message.Content.indexOf('开卖') ||
      ~message.Content.indexOf('销售') || ~message.Content.indexOf('哪里') ||
      ~message.Content.indexOf('买') || ~message.Content.indexOf('怎么')) &&
      message.Content && message.Content.length > 2) {
      ctx.body = '您好，咱们的黑科技还在紧锣密鼓的内部测试中，如果也想加入，可以先填写问卷\n' +
      wj + '\n' +
      '并留下手机号'
    } else if (telRe.test(message.Content) && message.Content && message.Content.length > 4) {
      ctx.body = '您好，系统已登记。\n' +
      '如果还未填写问卷，请先填写问卷，\n' +
      wj
    } else if (~message.Content.indexOf('内测') && message.Content && message.Content.length > 1) {
      ctx.body = '您好，如果想加入内测，可以先填写问卷\n' +
      wj + '\n' +
      '并留下手机号'
    } else if (~message.Content.indexOf('我要查询') && message.Content && message.Content.length > 4) {
      let searchTag = message.Content.substring(4)
      let tags = await client.handle('fetchTags')
      tags = tags['tags']
      tags = tags.filter(item => item.name === searchTag)
      if (tags && tags.length) {
        const fetchTagUsersResponse = await client.handle('fetchTagUsers', tags[0].id)
        if (fetchTagUsersResponse.data.openid && fetchTagUsersResponse.data.openid.length) {
          let replyStr = ''
          for (let i = 0; i < fetchTagUsersResponse.data.openid.length; i++) {
            const element = fetchTagUsersResponse.data.openid[i]
            const userInfoResponse = await client.handle('getUserInfo', element)
            replyStr += (userInfoResponse.nickname + ',')
            console.log(userInfoResponse)
          }
          replyStr = replyStr.substring(0, replyStr.length - 1)
          ctx.body = '用户有:' + replyStr
        } else {
          ctx.body = '该标签下没有添加用户'
        }
      } else {
        ctx.body = '找不到该标签'
      }
    } else if (message.Content === '222') {
      let meunInfo = await client.handle('getMenu')
      console.log(meunInfo)
      ctx.body = 'hahahah'
    } else if (message.Content === '更新按钮吧') {
      const menu = require('./menu').default
      let menuMsg = '创建成功'
      try {
        await client.handle('delMenu')
      } catch (e) {
        console.log('删除菜单失败')
        console.log(e)

        menuMsg = '删除失败'
      }

      try {
        const createResult = await client.handle('createMenu', menu)
        console.log(createResult)
      } catch (err) {
        console.log('创建菜单失败')
        console.log(err)
        menuMsg += menuMsg
      }

      ctx.body = menuMsg
    } else if (message.Content === 'bt' || message.Content === '3') {
      ctx.body = bt
    } else if (message.Content === 'kf') {
      ctx.body = [{
        title: '脑中风康复训练',
        description: '通过压力传感器，协助医生观察足部训练的受力情况，并通过评估功能来判断病患情况来使用训练功能进行康复训练',
        picUrl: 'http://mmbiz.qpic.cn/mmbiz_jpg/knCHmO7t1HPM65O26N6NSI2genC7WFmXXyGoXxnqyOz49FQ4jBpslrDUQqOgZZo8M6C8ibQcOQV1e8fknNticcQQ/0',
        url: 'https://itunes.apple.com/app/id1276483563'
      }]
    }
  } else if (message.MsgType === 'image') {
    let dbUser = await User.findOne({openid: message.FromUserName}).exec()
    var newMedia = TmpMedia({
      userId: dbUser.userId,
      tmpMediaId: message.MediaId
    })
    newMedia.save()
    let count = await TmpMedia.count({userId: {$ne: dbUser.userId}, 'liveUntil': {$gte: Date.now() - 86400000}}).exec()
    var random = Math.floor(Math.random() * count)
    let tmpMedia = await TmpMedia.findOne({userId: {$ne: dbUser.userId}, 'liveUntil': {$gte: Date.now() - 86400000}}).skip(random).exec()
    console.log(tmpMedia)
    if (tmpMedia) {
      ctx.body = {
        type: 'image',
        mediaId: tmpMedia.tmpMediaId
      }
    }
  } else if (message.MsgType === 'voice') {
    ctx.body = {
      type: 'voice',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'video') {
    ctx.body = {
      type: 'video',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'location') {
    ctx.body = message.Location_X + ' : ' + message.Location_Y + ' : ' + message.Label
  } else if (message.MsgType === 'link') {
    ctx.body = [{
      title: message.Title,
      description: message.Description,
      picUrl: 'http://mmbiz.qpic.cn/mmbiz_jpg/knCHmO7t1HPM65O26N6NSI2genC7WFmXXyGoXxnqyOz49FQ4jBpslrDUQqOgZZo8M6C8ibQcOQV1e8fknNticcQQ/0',
      url: message.Url
    }]
  }
}
