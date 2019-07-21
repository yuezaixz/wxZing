const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 进入相关微信群
const LookforSchema = new Schema({
  tookforId: { type: Number, default: 0 },
  userId: String,
  targetId: String,
  lookforCount: { type: Number, default: 0 },
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
LookforSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  if (!this.tookforId) {
    const Counter = mongoose.model('Counter')
    var doc = this
    Counter.findByIdAndUpdate({_id: 'tookforId'}, { $inc: {seq: 1} }, function (error, counter) {
      console.log('tookforId:', error, counter)
      if (error) {
        return next(error)
      }
      if (counter) {
        doc.tookforId = counter.seq
        console.log('save tookfor:', doc.userId)
      }
      next()
    })
  } else {
    next()
  }
})

mongoose.model('Lookfor', LookforSchema)
