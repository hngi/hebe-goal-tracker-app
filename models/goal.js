const mongoose = require('mongoose')

const goalSchema = new mongoose.Schema({
  title: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  todos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo"
    }
  ]
})
module.exports = mongoose.model('Goal', goalSchema)