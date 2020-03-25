// Imports
const express = require('express');
const morgan = require('morgan');
const path = require('path');

// Initialitzations
const app = express();

// Settings
app.set('port', process.env.PORT || 4000);

// Middlewares
app.use(morgan('dev'));
app.use(express.json());


// Globar Variables

// Routes
app.use(require('./routes'))
app.use(require('./routes/register.js'))

// Public
app.use(express.static(path.join(__dirname, 'public')))

// Starting the server
app.listen(app.get('port'), () =>
    console.log('Server on port', app.get('port'))
)