const passport = require("passport");
const { googleCallbacks } = require("./auth/auth.controller");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv");
dotenv.config({
  path: "./.env.development",
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.UrlPathName}auth/google/callback`,
      passReqToCallback: true,
    },
    googleCallbacks
  )
);

// Serialize and deserialize user for sessions
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
