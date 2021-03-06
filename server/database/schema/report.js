const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 互赞
const ReportSchema = new Schema({
  reportId: { type: Number, default: 0 },
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
ReportSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  if (!this.reportId) {
    const Counter = mongoose.model('Counter')
    var doc = this
    Counter.findByIdAndUpdate({_id: 'reportId'}, { $inc: {seq: 1} }, function (error, counter) {
      console.log('reportId:', error, counter)
      if (error) {
        return next(error)
      }
      if (counter) {
        doc.reportId = counter.seq
        console.log('save report:', doc.userId)
      }
      next()
    })
  } else {
    next()
  }
})

mongoose.model('Report', ReportSchema)
