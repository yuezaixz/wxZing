/* eslint-disable */
import { controller, get, post, log, required } from '../decorator/router'
import mongoose from 'mongoose'
import { dayTimeStr } from '../wechat-lib/util'

const Interest = mongoose.model('Interest')
const Activity = mongoose.model('Activity')
const ActivityApply = mongoose.model('ActivityApply')
const Zing = mongoose.model('Zing')
const Lookfor = mongoose.model('Lookfor')

@controller('/activity')
export class DatabaseController {

  @get('users')
  async dbUsers(ctx, next) {
    const res = await User.find({}).exec()

    ctx.body = res
  }

}
