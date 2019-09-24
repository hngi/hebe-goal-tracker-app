const express = require('express')
const logger = require('morgan')
const path = require('path')
const passport = require('passport')
const cors = require('cors')
const LocalStrategy = require('passport-local')
const mongoose = require('mongoose')
const User = require('./models/user')
const app = express()
const PORT = process.env.PORT || 8000
 const url = `mongodb://team_hebe:teamhebe123@ds145283.mlab.com:45283/team_hebe_goal_tracker_app`
//const url = 'mongodb://localhost/teamhebeauth'
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true},()=>{
  console.log('connected to database')
})

app.use(cors())
app.use(logger('dev'))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(require('express-session')({ secret: 'super-secret-secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.get('/', (req, res)=>{
  res.render('pages/home')
})

app.get('/dashboard', isLoggedIn, (req, res)=>{
  res.render('pages/dashboard')
})

// Auth Routes
app.get('/signup', (req, res)=>{
  res.render('pages/signup')
})

app.post('/signup', async(req, res)=>{
  const {username, password} = req.body
  const userExists = await User.findOne({username})
  if(userExists){
    console.log('username must be unique')
    return res.render('pages/signup')
  }
  const newUser = await User.register(new User({username}), password)
  if(!newUser){
    console.log(err)
    return res.render('pages/signup')
  }
  passport.authenticate('local')(req, res, ()=>{
    res.redirect('/dashboard')
  })
})

//Login Routes
app.get('/signin', (req, res)=>{
  res.render('pages/signin')
})

app.post('/signin', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/signin'
}), (req, res)=>{
  
})
app.get('/logout', (req, res)=>{
  req.logout()
  res.redirect('/')
})

// Auth Middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect('/signin')
}


app.listen(PORT, ()=>{
  console.log('server listening at port', PORT)
})