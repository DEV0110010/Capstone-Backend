const express = require('express');
const passport = require('passport');
const { getAllUsers, updateUser, deleteUser } = require('../controllers/userController');

const router = express.Router();

// Middleware to protect admin routes
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Forbidden: Admins only' });
};

// Get all users
router.get('/', passport.authenticate('jwt', { session: false }), isAdmin, getAllUsers);

// Update user by ID
router.put('/:id', passport.authenticate('jwt', { session: false }), isAdmin, updateUser);

// Delete user by ID
router.delete('/:id', passport.authenticate('jwt', { session: false }), isAdmin, deleteUser);

module.exports = router;
