const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  item: String,
  completed: {Type: Boolean, default: false}
})

module.exports = mongoose.model('Todo', todoSchema) 