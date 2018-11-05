const mongoose = require('mongoose')
const Schema = mongoose.Schema

var CounterSchema = new Schema({
  _id: {type: String, required: true},
  seq: { type: Number, default: 0 }
})

mongoose.model('Counter', CounterSchema)
