const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  username: String,
  password: String,
  goals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Goal"
  }]
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userSchema)