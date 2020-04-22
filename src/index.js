// Imports
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
require('./lib/passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MySQLStore = require('express-mysql-session');
const { database } = require('./keys');

// Initialitzations
const app = express();


// Settings
app.set('port', process.env.PORT || 4000);

// Middlewares

/* app.use(function(req, res, next) {
    res.header('Accept-Ranges: bytes')
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH')
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Powered-By,Accept-Ranges,Content-Type,Content-Length,ETag,Vary,Date,Connection');
    res.header('Access-Control-Expose-Headers', 'X-Powered-By, Accept-Ranges, Content-Type, Content-Length, ETag, Vary, Date, Connection')
    if ('OPTIONS' == req.method) {
         res.sendStatus(200);
     } else {
         next();
     }
    }); */

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use(session({
    secret: 'keyboardcat',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}))
app.use(passport.initialize());
app.use(passport.session());

// Globar Variables

app.use((req, res, next) => {
    app.locals.user = req.user;
    next();
})

// Routes
app.use(require('./routes'))





// Public
app.use(express.static(path.join(__dirname, 'public')))

// Starting the server
const server = app.listen(app.get('port'), () =>
    console.log('Server on port', app.get('port'))
)
const pool = require('./database');