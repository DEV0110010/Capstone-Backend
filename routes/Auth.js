const express = require('express')
const router = express.Router()
const passport =require("passport");
const jwt = require("jsonwebtoken");
const {register, login, logout , getUser, isAuthenticated, isAdmin, isUser} = require('../controllers/authController');
const { JsonWebTokenError } = require('jsonwebtoken');

router.post('/register', register);
router.post('/login',passport.authenticate('local'),login);
router.get('/logout', logout);
router.get('/current', [passport.authenticate("jwt", {session: false})], getUser);
router.get('/profile', [passport.authenticate("jwt", {session: false})], (req,res) =>{
    try {
        res.send(req.user);
    } catch (error) {
        console.log(error);  
    }
});
router.get('/admin', [passport.authenticate("jwt", {session: false})],isAdmin, (req, res) => {
    try {
        res.send('Welcome, Admin!');
    } catch (err) {
        res.send(err)
    }
});

router.get('/user',[passport.authenticate("jwt", {session: false})], isUser, (req, res) => {
    try {
        res.send('Welcome, User!'); 
    } catch (error) {
        res.send(err);
    }
  
});

module.exports = router;