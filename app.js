const express = require('express')
const logger = require('morgan')
const path = require('path')
const passport = require('passport')
const cors = require('cors')
const LocalStrategy = require('passport-local')
const mongoose = require('mongoose')
const User = require('./models/user')
const Goal = require('./models/goal')
const Todo = require('./models/todo')
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

app.use((req,res,next)=>{
  res.locals.user = req.user
  next()
})

app.get('/', (req, res)=>{
  res.render('pages/home')
})

// Protected Routes
app.get('/dashboard', isLoggedIn, (req, res)=>{
  console.log(req.isAuthenticated())
  res.render('pages/dashboard')
})

app.get('/api/goals', isLoggedIn, async(req, res, next)=>{
  const goals = await Goal.find({owner: req.user.id}).populate('todos').exec()
  res.json({goals})
})

// Create A Goal
app.post('/api/goals', isLoggedIn, async(req, res, next)=>{
  try{
    const newGoal = await new Goal({
      owner: req.user._id,
      title: req.body.title,
    })
    if(newGoal){
      await newGoal.save()
      res.json({newGoal: newGoal})
    }
  }catch(err){
    res.json({
      error: err.message
    })
  }
})

// Edit A Goal
app.put('/api/goals/:id', isLoggedIn, async(req, res, next)=>{
  try{
    const currentGoal = Goal.findById(req.params.id)
    if(currentGoal.owner.equals(req.user._id)){
      await Goal.findByIdAndUpdate(req.params.id, req.body)
    }
    res.redirect('/dashboard')
  }catch(err){
    res.json({
      error: err.message
    })
  }
})

// Remove A Goal
app.delete('/api/goals/:id', isLoggedIn, async(req, res, next)=>{
  try{
    const currentGoal = Goal.findById(req.params.id)
    if(currentGoal.owner.equals(req.user._id)){
      await Goal.findByIdAndRemove(req.params.id, req.body)
    }
    res.status(301).redirect('/dashboard')
  }catch(err){
    res.json({
      error: err.message
    })
  }
})

// Add a todo to a goal
app.post('/api/goals/:id/todo', isLoggedIn, async(req, res, next)=>{
  try{
    const goal = await Goal.findById(req.params.id)
    if(goal){
      const newTodo = await new Todo({item: req.body.item})
      newtodo.owner = req.user._id
      newTodo.save()
      await goal.todos.push(newTodo)
      await goal.save()
      res.status(200).json({goal})
    }
  }catch(err){
    res.json({
      error: err.message
    })
  }
})

// Edit A Todo
app.put('/api/goals/todos/:id', isLoggedIn, async(req, res, next)=>{
  try{
    const currentTodo = Todo.findById(req.params.id)
    if(currentTodo.owner.equals(req.user._id)){
      await Todo.findByIdAndUpdate(req.params.id, req.body)
    }
    res.redirect('/dashboard')
  }catch(err){
    res.json({error: err.message})
  }
})

// Remove A Todo
app.delete('/api/goals/todos/:id', isLoggedIn, async(req, res, next)=>{
  try{
    const currentTodo = Todo.findById(req.params.id)
    if(currentGoal.owner.equals(req.user._id)){
      await Todo.findByIdAndRemove(req.params.id, req.body)
    }
    res.status(301).redirect('/dashboard')
  }catch(err){
    res.json({error: err.message})
  }
})

app.get('/signup', (req, res)=>{
  res.render('pages/signup', {error: "Username is taken"})
})

app.get('/signin', (req, res)=>{
  res.render('pages/signin')
})
// Auth Routes
app.post('/signup', async(req, res)=>{
  try{
    const {username, password} = req.body
    const userExists = await User.findOne({username})
    if(userExists){
      console.log('username must be unique')
      return res.render('pages/signup')
    }
    const newUser = await User.register(new User({lastname: req.body['last-name'], firstname: req.body['first-name'], email: req.body.email, username: req.body.username}), password)
    if(!newUser || !req.body.username){
      console.log(err)
      return res.render('pages/signup')
    }
    passport.authenticate('local')(req, res, ()=>{
      res.redirect('/dashboard')
    })
  }catch(err){
    res.json(err)
  }
})

app.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin'
}), (req, res)=>{
  res.status(301).redirect('/dashboard')
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