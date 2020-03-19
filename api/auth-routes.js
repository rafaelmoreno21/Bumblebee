let router = require('express').Router()
const jwt = require('jsonwebtoken')

const User = require('./models/user')

router.get('/', function (req, res) {
    res.json({
        status: 'Working',
        message: 'Auth'
    })
})


router.route('/login')
  .post(async function (req, res) {

    try {

      var user = await User.findOne({
        $or: [
          { username: req.body.username },
          { email: req.body.username }
        ]
      })

      var result = await user.comparePassword(req.body.password)

      if (result) {

        var token = jwt.sign({ username: req.body.username }, process.env.TOKEN_SECRET, { expiresIn: '2h' })
        res.status(200).json({
          status: 'ok',
          message: 'Login',
          token
        })

      } else {

        res.status(400).json({
          status: 'error',
          message: 'Login'
        })

      }

    } catch (err) {

      console.error(err)

      res.status(400).json({
        status: "error",
        error: err
      })
    }
  })

router.route('/register')
  .post(async function (req, res) {

    if (req.body.secret!==process.env.AUTH_SECRET) {
      res.json({
        status: 'Error',
        message: 'Register not available'
      })
      return
    }

    var user = new User()

    user.username = req.body.username
    user.password = req.body.password
    user.email = req.body.email

    user.save(function (err) {
      if (err) {
        res.status(400).json(err)
      } else {
        res.status(200).json({
          message: 'New user created!',
          data: {username: user.username, email: user.email}
        })
      }
    })
  })

module.exports = router
