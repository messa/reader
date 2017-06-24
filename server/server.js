import express from 'express'
import next from 'next'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import session from 'express-session'
import passport from 'passport'
import { Strategy as FacebookStrategy } from 'passport-facebook'

import configuration from './configuration'
import { modelFromConfiguration } from './model'

const modelPromise = modelFromConfiguration(configuration);

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// configura passport
passport.use(new FacebookStrategy({
    clientID: configuration.get('facebook_login:app_id'),
    clientSecret: configuration.get('facebook_login:app_secret'),
    callbackURL: configuration.get('facebook_login:callback_url'),
    profileFields: ['id', 'displayName', 'email']
  },
  (accessToken, refreshToken, profile, done) => {
    console.info('FB profile:', profile);
    modelPromise.then((model) => {
      return model.loginUserFB({
        displayName: profile.displayName,
        fbId: profile.id,
        email: profile.emails[0].value,
      })
    }).then((user) => {
      done(null, user);
    }).catch((err) => {
      done(err, null);
    });
  }
));

passport.serializeUser((user, done) => {
  console.info('serializeUser user:', user);
  done(null, user.userId);
});

passport.deserializeUser((id, done) => {
  modelPromise.then((model) => {
    return model.getUserById(id);
  }).then((user) => {
    console.info('deserializeUser id:', id, ' -> user:', user.toString());
    done(null, user);
  }).catch((err) => {
    done(err, null);
  })
});

app.prepare()
.then(() => {
  const server = express()

  server.use(cookieParser())
  server.use(bodyParser.urlencoded({ extended: true }))
  server.use(bodyParser.json())
  server.use(session({
    secret: configuration.get('session_secret'),
    resave: false,
    saveUninitialized: true,
    cookie: {
      name: 'readerSid'
    }
  }))
  server.use(passport.initialize())
  server.use(passport.session())

  server.get('/login/via-facebook',
    passport.authenticate('facebook', {
      scope: ['public_profile', 'email']
    }));

  server.get('/login/facebook-callback',
    passport.authenticate('facebook', {
      successRedirect: '/dashboard',
      failureRedirect: '/'
    }));

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
