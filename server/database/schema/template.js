const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TemplateSchema = new Schema({
  templateId: { type: Number, default: 0 },
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
TemplateSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  if (!this.templateId) {
    const Counter = mongoose.model('Counter')
    var doc = this
    Counter.findByIdAndUpdate({_id: 'templateId'}, { $inc: {seq: 1} }, function (error, counter) {
      console.log('templateId:', error, counter)
      if (error) {
        return next(error)
      }
      if (counter) {
        doc.templateId = counter.seq
        console.log('save template:', doc.userId)
      }
      next()
    })
  } else {
    next()
  }
})

mongoose.model('Template', TemplateSchema)
