const express = require("express");
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
// const cors = require('cors');
const authRoutes = require('./routes/Auth');
require('dotenv').config();
require('./config/passport');

const app = express();
// app.use(cors({origin: 'http://localhost:3000', credentials: true}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI).then((e) => console.log(`Connected to mongoDB: ${e.connection.host}`)).catch((e) => {
console.log(e);
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // Added user routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);  
});