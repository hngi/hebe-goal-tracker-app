module.exports = {
  landing: async(req, res, next)=>{
    res.status(200).render('../views/pages/landing', {title: 'Landing Page'})
  },
  signup: async(req, res, next)=>{
    res.status(200).render('../views/pages/signup.ejs', {title: 'Signup Page'})
  },
  signin: async(req, res, next)=>{
    res.status(200).render('../views/pages/login.ejs', {title: 'Login Page'})
  }
}