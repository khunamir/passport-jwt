const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../model/model');

const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use('signup', new localStrategy ({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await UserModel.create({ email, password });
        return done(null, user); // return user to the next middleware
    } catch (err) {
        done(err);
    }
}));

passport.use('login', new localStrategy ({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await UserModel.findOne({ email: email });

        if (!user) {
            return done(null, false, { message: 'User not found' });
        }

        const validate = user.isValidPassword(password);

        if (!validate) {
            return done(null, false, { message: 'Invalid password' });
        }

        return done(null, user, { message: 'Logged in successfully' });
    } catch (err) {
        done(err);
    }
}));

passport.use(new JWTStrategy({
    secretOrKey: 'top_secret',
    jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
}, async (token, done) => {
    try {
        return done(null, token.user);
    } catch(error) {
        return done(error);
    }
}));

