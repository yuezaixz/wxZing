const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 互赞
const ZingSchema = new Schema({
  zingId: { type: Number, default: 0 },
  userId: String,
  targetId: String,
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
ZingSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  if (!this.zingId) {
    const Counter = mongoose.model('Counter')
    var doc = this
    Counter.findByIdAndUpdate({_id: 'zingId'}, { $inc: {seq: 1} }, function (error, counter) {
      console.log('zingId:', error, counter)
      if (error) {
        return next(error)
      }
      if (counter) {
        doc.zingId = counter.seq
        console.log('save zing:', doc.userId)
      }
      next()
    })
  } else {
    next()
  }
})

mongoose.model('Zing', ZingSchema)
