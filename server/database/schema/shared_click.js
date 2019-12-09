const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 互赞
const SharedClickSchema = new Schema({
  sharedClickId: { type: Number, default: 0 },
  clickUserId: Number,
  sharedUserId: Number,
  activityId: Number,
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
SharedClickSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  if (!this.sharedClickId) {
    const Counter = mongoose.model('Counter')
    var doc = this
    Counter.findByIdAndUpdate({_id: 'sharedClickId'}, { $inc: {seq: 1} }, function (error, counter) {
      console.log('sharedClickId:', error, counter)
      if (error) {
        return next(error)
      }
      if (counter) {
        doc.sharedClickId = counter.seq
        console.log('save sharedClick:', doc.userId)
      }
      next()
    })
  } else {
    next()
  }
})

mongoose.model('SharedClick', SharedClickSchema)
