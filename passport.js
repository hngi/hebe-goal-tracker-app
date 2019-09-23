const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const User = require('./models/user')
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('Authorization'),
  secretOrKey: 'super-secret-secret'
}, async(payload, done)=>{
  try{
    const user = await User.findById(payload.sub)
    if(!user){
      return done(null, false)
    }
    done(null, user)
  }catch(error){
    done(error, false)
  }
}))
// module.exports = async (req, res, next) => {
//   try{
//     const authHeader = await req.get('Authorization')
//     if(authHeader){
//       const token = await authHeader.split(' ')[1]
//       let decodedToken = await jwt.verify(token, publicKey, {algorithm: ["RS256"]})
//       if(decodedToken){
//         req.isAuth = true
//         req.userId = decodedToken.userId
//         next()
//       }
//     }
//     else{
//       req.isAuth = false
//       return next()
//     }
//   }catch(err){return err}
// }