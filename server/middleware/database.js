import mongoose from 'mongoose'
import config from '../config'
import fs from 'fs'
import {
  resolve
} from 'path'

const models = resolve(__dirname, '../database/schema')
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^.].*.js$/))
  .forEach(file => require(resolve(models, file)))

export const database = app => {
  if (config.env === 'development') {
    mongoose.set('debug', true)
  }

  mongoose.connect(config.db)
  mongoose.connection.on('disconnect', () => {
    mongoose.connect(config.db)
  })

  mongoose.connection.on('error', err => {
    console.log(err)
  })

  mongoose.connection.on('open', async _ => {
    console.log('Connect to MongoDB', config.db)

    const Counter = mongoose.model('Counter')
    {
      let counter = await Counter.findOne({_id: 'entityId'}).exec()
      if (!counter) {
        await new Counter({_id: 'entityId'}).save()
      }
    }

    {
      let smsCodeCounter = await Counter.findOne({_id: 'smsCodeId'}).exec()
      if (!smsCodeCounter) {
        await new Counter({_id: 'smsCodeId'}).save()
      }
    }

    {
      let activityApplyCounter = await Counter.findOne({_id: 'activityApplyId'}).exec()
      if (!activityApplyCounter) {
        await new Counter({_id: 'activityApplyId'}).save()
      }
    }

    {
      let activityCounter = await Counter.findOne({_id: 'activityId'}).exec()
      if (!activityCounter) {
        await new Counter({_id: 'activityId'}).save()
      }
    }

    {
      let interestCounter = await Counter.findOne({_id: 'interestId'}).exec()
      if (!interestCounter) {
        await new Counter({_id: 'interestId'}).save()
      }
    }

    {
      let zingCounter = await Counter.findOne({_id: 'zingId'}).exec()
      if (!zingCounter) {
        await new Counter({_id: 'zingId'}).save()
      }
    }

    {
      let blackCounter = await Counter.findOne({_id: 'blackId'}).exec()
      if (!blackCounter) {
        await new Counter({_id: 'blackId'}).save()
      }
    }

    {
      let reportCounter = await Counter.findOne({_id: 'reportId'}).exec()
      if (!reportCounter) {
        await new Counter({_id: 'reportId'}).save()
      }
    }

    {
      let tookforCounter = await Counter.findOne({_id: 'tookforId'}).exec()
      if (!tookforCounter) {
        await new Counter({_id: 'tookforId'}).save()
      }
    }

    if (config.env === 'development') {
      // User.removeAll()
      // var users = require('database/json/testUser.json')
      // User.insertMany(users)
    }

    // let user = await User.findOne({email: '303178394@qq.com'}).exec()
    // if (!user) {
    //   await new User({email: '303178394@qq.com', password: '123456', role: 'admin', userId: -1}).save()
    // }
    // let testUsers = await User.find({}).exec()
    // console.log('test', testUsers)
  })
}
