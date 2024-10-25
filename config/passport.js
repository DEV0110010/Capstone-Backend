const passport = require('passport');
const  JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const usermodel = require("../models/usermodel");
const bcrypt = require('bcrypt');

// Local Strategy for Login 
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await usermodel.findOne({ username });
      if(!user) return done(null, false, {message: 'Incorrect username.'});

      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch) return done(null, false, {message: 'Incorrect password'});

      return done(null, user);
    } catch (err) {
      return done (err);
    }
  }
));

// JWT Strategy for authorization
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    
    const user = await usermodel.findById(jwt_payload.id);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false); // User not found
    }
  } catch (err) {
    return done(err, false); // Error occurred
  }
}));


passport.serializeUser((user, done) => {
  done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await usermodel.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

