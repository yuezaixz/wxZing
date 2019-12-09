const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 互赞
const TmpMediaSchema = new Schema({
  tmpMediaId: String,
  userId: Number,
  liveUntil: {
    type: Number,
    default: Date.now()
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
TmpMediaSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

mongoose.model('TmpMedia', TmpMediaSchema)
