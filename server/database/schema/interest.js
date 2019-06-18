const mongoose = require('mongoose')
const Schema = mongoose.Schema

const InterestSchema = new Schema({
  interestId: { type: Number, default: 0 },
  name: String,
  aboutInterest: String,
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
InterestSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  if (!this.interestId) {
    const Counter = mongoose.model('Counter')
    var doc = this
    Counter.findByIdAndUpdate({_id: 'interestId'}, { $inc: {seq: 1} }, function (error, counter) {
      console.log('interestId:', error, counter)
      if (error) {
        return next(error)
      }
      if (counter) {
        doc.interestId = counter.seq
        console.log('save interest:', doc.userId)
      }
      next()
    })
  } else {
    next()
  }
})

mongoose.model('Interest', InterestSchema)
