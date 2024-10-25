const usermodel = require("../models/usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const {username, email, password} = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new usermodel({username, email, password: hashedPassword});
  await newUser.save();
  res.status(201).json({message: "User registered"});
};

exports.login = async (req,res) => {
  const user = req.user; //from local strategy
  const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
  res.json({user: { id: user._id, username: user.username, email: user.email }, token})
};

exports.logout = (req, res) => {
  req.logout();
  res.json({message: "Logged out"});
}

exports.getUser = (req,res) => {
res.json({ id: req.user._id, username: req.user.username, email: req.user.email });
};