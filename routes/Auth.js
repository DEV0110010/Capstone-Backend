const express = require('express')
const router = express.Router()
const passport =require("passport");
const {register, login, logout , getUser} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', passport.authenticate('local'), login);
router.get('/logout', logout);
router.get('/current', passport.authenticate('jwt', {session: false}), getUser);

module.exports = router;