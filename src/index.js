// Imports
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
// Initialitzations
const app = express();

// Settings
app.set('port', process.env.PORT || 4000);

// Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());


// Globar Variables

// Routes
app.use(require('./routes'))

// Public
app.use(express.static(path.join(__dirname, 'public')))

// Starting the server
const server = app.listen(app.get('port'), () =>
    console.log('Server on port', app.get('port'))
)
const pool = require('./database');