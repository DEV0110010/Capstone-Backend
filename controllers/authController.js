const usermodel = require("../models/usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    // Default to 'user' role if not provided
    const userRole = role && (role === 'user' || role === 'admin') ? role : 'user';
    // Check if the user already exists
    const existingUser = await usermodel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    const newUser = new usermodel({ username, email, password: hashedPassword, role: userRole });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.login = async (req, res) => {
  const user = req.user; // from local strategy
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign(
    { id: user._id},
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  res.json({
    user: { _id: user._id, username: user.username, email: user.email, role: user.role },
    token,
  });
};

exports.logout = (req, res) => {
  req.logout();
  res.json({message: "Logged out"});
}

exports.getUser = (req,res) => {
  res.json({ id: req.user._id, username: req.user.username, email: req.user.email });
};

function checkRole(role) {
  return (req, res, next) => {
    console.log(req.user);
    if (req.user && req.user.role === role) {
      next(); // User has the correct role
    } else {
      res.status(403).send('Access denied.'); // Forbidden
    }
  };
}

// Middleware to check if the user is an admin
exports.isAdmin = checkRole('admin');

// Middleware to check if the user is a regular user
exports.isUser = checkRole('user');
