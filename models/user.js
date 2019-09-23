const mongoose = require('mongoose')
const url = `mongodb://team_hebe:teamhebe123@ds145283.mlab.com:45283/team_hebe_goal_tracker_app`
console.log('connecting to', url)

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, 'useFindAndModify': false, 'useCreateIndex': true})
.then(result=>{
  console.log('connected to database')
}).catch(error=>{
  console.error('error connecting to database:', error.message)
})

const userSchema = new mongoose.Schema({
  username: {type: String, minlength: 3, unique: true, required: true, lowercase: true},
  password: {type: String, minlength: 6, required: true}
})

userSchema.set('toJSON', {
  transform: (document, transformedDocument)=>{
    transformedDocument.id = transformedDocument._id.toString()
    delete transformedDocument._id
    delete transformedDocument.__v
  }
})

module.exports = mongoose.model('User', userSchema)