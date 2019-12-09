const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BlackSchema = new Schema({
  blackId: { type: Number, default: 0 },
  userId: Number,
  targetId: Number,
  msg: String,
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
BlackSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  if (!this.blackId) {
    const Counter = mongoose.model('Counter')
    var doc = this
    Counter.findByIdAndUpdate({_id: 'blackId'}, { $inc: {seq: 1} }, function (error, counter) {
      console.log('blackId:', error, counter)
      if (error) {
        return next(error)
      }
      if (counter) {
        doc.blackId = counter.seq
        console.log('save black:', doc.userId)
      }
      next()
    })
  } else {
    next()
  }
})

mongoose.model('Black', BlackSchema)
