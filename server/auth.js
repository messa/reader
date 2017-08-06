import { Router } from 'express'
import passport from 'passport'
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth'

import configuration from './configuration'

// http://passportjs.org/docs/google
passport.use(new GoogleStrategy({
    clientID:       configuration.get('google_oauth2:client_id'),
    clientSecret:   configuration.get('google_oauth2:client_secret'),
    callbackURL:    configuration.get('google_oauth2:callback_url'),
    passReqToCallback: true,
  },
  (req, accessToken, refreshToken, profile, done) => {
    console.info("profile:", profile);
    const googleId = profile.id;
    const userInfo = {
      googleId: profile.id,
      displayName: profile.displayName,
    };
    const user = req.model.users.getOrCreateByGoogleId({ userInfo });
    console.info("user:", user);
    return done(null, {...userInfo, userId: user.id });
  }
))

passport.serializeUser((user, done) => {
  done(null, { uesrId: user.id });
})

passport.deserializeUser((req, userId, done) => {
  done(null, req.model.users.getById(userId));
})

export function setupServer(server) {
  server.use(passport.initialize());
  server.use(passport.session());
}

export const authRouter = Router();

authRouter.get('/auth/google/',
  passport.authenticate('google', {
    // prompt: 'select_account',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ]
  }));

authRouter.get('/auth/google/callback',
  passport.authenticate(
    'google',
    { failureRedirect: '/' }
  ),
  (req, res) => {
    console.info("Google authentication successfull");
    res.redirect('/timeline');
  });
