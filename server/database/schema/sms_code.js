const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SmsCodeSchema = new Schema({
  smsCodeId: { type: Number, default: 0 },
  tel: String,
  secode: String,
  ip: String,
  recordDate: String,
  sendCount: Number,
  expiresIn: Number,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

// 保存前，设定创建时间或更新时间
SmsCodeSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = new Date()
  } else {
    this.meta.updatedAt = new Date()
  }

  if (!this.smsCodeId) {
    const Counter = mongoose.model('Counter')
    var doc = this
    Counter.findByIdAndUpdate({_id: 'smsCodeId'}, { $inc: {seq: 1} }, function (error, counter) {
      console.log('smsCodeId:', error, counter)
      if (error) {
        return next(error)
      }
      if (counter) {
        doc.smsCodeId = counter.seq
        console.log('save smsCode:', doc.userId)
      }
      next()
    })
  } else {
    next()
  }
})

mongoose.model('SmsCode', SmsCodeSchema)
