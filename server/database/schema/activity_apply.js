const mongoose = require('mongoose')
const { Schema } = mongoose
const ObjectId = Schema.Types.ObjectId

const ActivityApplySchema = new Schema({
  activityApplyId: { type: Number, default: 0 },
  activity: {
    type: ObjectId,
    ref: 'Activity'
  },
  userId: Number,
  isSuccess: {
    type: Boolean,
    default: false
  },
  isHandle: {
    type: Boolean,
    default: false
  },
  isCancel: {
    type: Boolean,
    default: false
  },
  fellowUserId: Number,
  memo: String,
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
ActivityApplySchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  if (!this.activityApplyId) {
    const Counter = mongoose.model('Counter')
    var doc = this
    Counter.findByIdAndUpdate({_id: 'activityApplyId'}, { $inc: {seq: 1} }, function (error, counter) {
      console.log('activityApplyId:', error, counter)
      if (error) {
        return next(error)
      }
      if (counter) {
        doc.activityApplyId = counter.seq
        console.log('save activityApply:', doc.userId)
      }
      next()
    })
  } else {
    next()
  }
})

mongoose.model('ActivityApply', ActivityApplySchema)
