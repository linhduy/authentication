var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');           // for error message
var cookieParser = require('cookie-parser');    // for cookie
var bodyParser   = require('body-parser');     
var session      = require('express-session');  

var configDB = require('./config/database.js'); // for connect database

//Connect to my database
// mongoose.connect(configDB.uri, configDB.options);

require('./config/passport')(passport);

// set up express application
app.use(morgan('dev')); // log every request  to the console
app.use(cookieParser()); // read cookies
app.use(bodyParser()); //get body parameter

app.set('view engine', 'ejs'); //set up ejs for templating

//required for passport
app.use(session({secret: 'iloveyoumoamoa'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//routes
require('./app/routes.js')(app, passport);

//launch
app.listen(port);
console.log('what the f*** on port ' + port);