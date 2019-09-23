const JWT = require('jsonwebtoken')
const User = require('../models/user')

const signToken = user =>{
  return JWT.sign({
    iss: "hng6 team_hebe",
    sub: user.id,
    ist: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate()+1)
  }, 'super-secret-secret')
}

module.exports = {
  signup: async(req, res, next)=>{
    const {username, password} = req.body

    // check if a user exists
    const foundUser = await User.findOne({'username': username})
    if(foundUser){
      return res.status(403).json({error: 'Username must be unique'})
    }

    const newUser = new User({username, password })
    await newUser.save()
    
    const token = signToken(newUser)
    res.status(201).json({msg: 'user created', token: token})
  },
  
  signin: async(req, res, next)=>{
    console.log('signin page')
  },
  dashboard: async(req, res, next)=>{
    console.log('dashboard page')
  }
}