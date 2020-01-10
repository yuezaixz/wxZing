const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BrowseSchema = new Schema({
  browseId: { type: Number, default: 0 },
  userId: Number,
  targetId: Number,
  liveUntil: {
    type: Number,
    default: Date.now()
  },
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
BrowseSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  if (!this.browseId) {
    const Counter = mongoose.model('Counter')
    var doc = this
    Counter.findByIdAndUpdate({_id: 'browseId'}, { $inc: {seq: 1} }, function (error, counter) {
      console.log('browseId:', error, counter)
      if (error) {
        return next(error)
      }
      if (counter) {
        doc.browseId = counter.seq
        console.log('save browse:', doc.userId)
      }
      next()
    })
  } else {
    next()
  }
})

mongoose.model('Browse', BrowseSchema)
