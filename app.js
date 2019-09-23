const express = require('express')
const logger = require('morgan')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 8000

// Middlewares
app.use(logger('dev'))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin', '*'),
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS'),
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if(req.method === 'OPTIONS'){
    return res.sendStatus(200)
  }
  next()
})

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'))

// Routes

app.get('/', (req, res)=>{
  res.render('pages/landing', {title: 'landing page', year: 2019})
})

app.listen(PORT, ()=>{
  console.log(`Server listening on port ${PORT}`)
})