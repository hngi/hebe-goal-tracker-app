const router = require('express-promise-router')()
const { validateBody, schemas } = require('../helpers/routeHelpers')
const userController = require('../controllers/users')
const passport = require('passport')
require('../passport')

router.route('/signup')
  .post(validateBody(schemas.authSchema), userController.signup)

router.route('/signin')
  .post(userController.signin)

router.route('/:id/dashboard')
  .get(passport.authenticate('jwt', {session: false}), userController.dashboard)

module.exports = router
