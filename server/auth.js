import { Router } from 'express'
import passport from 'passport'
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth'
import { Strategy as TwitterStrategy } from 'passport-twitter'

import configuration from './configuration'

// http://passportjs.org/docs/google
passport.use(new GoogleStrategy(
  {
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
    return done(null, user);
  }
));

// http://passportjs.org/docs/twitter
passport.use(new TwitterStrategy(
  {
    consumerKey:    configuration.get('twitter_oauth:consumer_api_key'),
    consumerSecret: configuration.get('twitter_oauth:consumer_api_secret'),
    callbackURL:    configuration.get('twitter_oauth:callback_url'),
    passReqToCallback: true,
  },
  (req, token, tokenSecret, profile, done) => {
    console.info("Twitter token:", token);
    console.info("Twitter profile:", profile);
    if (req.session.authConnectAccount) {
      if (! req.user) {
        done("no_req_user", null);
      } else {
        req.user.addTwitterAccount({
          token, tokenSecret,
          twitterId: profile.id,
          username: profile.username,
          displayName: profile.displayName,
          rawProfile: profile,
        });
        done(null, null);
      }
    } else {
      done("only_connect_supported", null);
    }
  }
));


passport.serializeUser((user, done) => {
  console.info("serializeUser:", user);
  done(null, { userId: user.id });
})

passport.deserializeUser((req, {userId}, done) => {
  //console.info("deserializeUser userId:", userId);
  //console.info("deserializeUser req.session:", req.session);
  const user = req.model.users.getById(userId);
  console.info("deserializeUser:", userId, "->", user);
  done(null, user);
})

export function setupServer(server) {
  server.use(passport.initialize());
  server.use(passport.session());
}

export const authRouter = Router();

// Google

authRouter.get('/auth/google/', (req, res, next) => {
  req.session.authConnectAccount = false;
  const options = {
    // prompt: 'select_account',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ]
  };
  passport.authenticate('google', options)(req, res, next);
});

authRouter.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: '/timeline',
  }));

// Twitter

authRouter.get('/auth/connect-twitter',
  (req, res, next) => {
    req.session.authConnectAccount = true;
    passport.authorize('twitter')(req, res, next);
  });

authRouter.get('/auth/twitter/callback',
  passport.authorize('twitter', {
    successRedirect: '/connected-accounts',
    failureRedirect: '/connected-accounts',
  }));
