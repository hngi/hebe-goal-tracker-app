const router = require('express-promise-router')()
const indexController = require('../controllers/index')

router.route('/')
  .get(indexController.landing)

router.route('/signup')
  .get(indexController.signup)

router.route('/signin')
  .get(indexController.signin)

module.exports = router
