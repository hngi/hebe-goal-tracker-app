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
const User = require('../controllers/user');
const auth = require('./auth');
const mongoose = require('mongoose');


const goalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  importance: {
    type: Number,
    required: true
  },
  steps: {
    type: Array
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
 }, {
  timestamps: true
 });



module.exports = mongoose.model('Goal',GoalSchema);

