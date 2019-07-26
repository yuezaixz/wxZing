const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const ActivitySchema = new Schema({
  activityId: { type: Number, default: 0 },
  activityName: String,
  activityNo: String,
  memo: String,
  interest: [{
    type: ObjectId,
    ref: 'Interest'
  }],
  photoUrl: String,
  isOver: {
    type: Boolean,
    default: false
  },
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
ActivitySchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  if (!this.activityId) {
    const Counter = mongoose.model('Counter')
    var doc = this
    Counter.findByIdAndUpdate({_id: 'activityId'}, { $inc: {seq: 1} }, function (error, counter) {
      console.log('activityId:', error, counter)
      if (error) {
        return next(error)
      }
      if (counter) {
        doc.activityId = counter.seq
        console.log('save activity:', doc.userId)
      }
      next()
    })
  } else {
    next()
  }
})

mongoose.model('Activity', ActivitySchema)
