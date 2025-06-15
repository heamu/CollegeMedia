
import passport from "passport"
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from "../models/user.model.js"



passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback", // same as i  registered in Google console
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }

        // If not, create user
        const newUser = new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            profileImage: profile.photos?.[0]?.value || '',
        });


        const savedUser = await newUser.save();
        done(null, savedUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user.id); // store user id in session
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
   // console.log("from deserializer ::::---- : ",user)
    done(null, user); // available as req.user
  } catch (err) {
    done(err, null);
  }
});
