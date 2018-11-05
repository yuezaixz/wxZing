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

    const User = mongoose.model('User')
    const Counter = mongoose.model('Counter')
    let counter = await Counter.findOne({_id: 'entityId'}).exec()
    if (!counter) {
      await new Counter({_id: 'entityId'}).save()
    }

    if (config.env === 'development') {
      // User.removeAll()
      // var users = require('database/json/testUser.json')
      // User.insertMany(users)
    }

    let user = await User.findOne({email: '303178394@qq.com'}).exec()
    if (!user) {
      await new User({email: '303178394@qq.com', password: '123456', role: 'admin', userId: -1}).save()
    }
    let testUsers = await User.find({}).exec()
    console.log('test', testUsers)
  })
}
