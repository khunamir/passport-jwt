const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();
const UserModel = require('./model/model');

// connect to database
mongoose.connect(
    'mongodb://localhost/passport-jwt', 
    { useUnifiedTopology: true, useNewUrlParser: true , useFindAndModify: false},
).then(() => {
    console.log('connected to the database');
}).catch((error) => {
    console.log(error);
});

mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;

require('./auth/auth');

app.use(bodyParser.urlencoded({ extended: false }));

const routes = require('./routes/routes');
const secureRoute = require('./routes/secure-routes');

app.use('/', routes);
app.use('/user', passport.authenticate('jwt', { session: false }), secureRoute);

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: err });
});

app.listen(3000, () => {
    console.log('listening to port 3000');
});