const express = require('express');
const router = express.Router();
const path = require('path')
const passport = require('passport')

//Ruta de register per guardar usuari

router.post('/register', passport.authenticate('local.signup', {
  successRedirect: 'http://localhost:3000/Help',
  failureRedirect: 'http://localhost:3000/Reg',
}))



//Ruta de login per validar la autentificació de l'usuari

router.post('/login', passport.authenticate('local.signin', {
    successRedirect: 'http://localhost:3000/',
    failureRedirect: 'http://localhost:3000/Reg',
  }))

router.get('/api', (req, res, next) =>{
  res.sendFile('index.html', { root: path.join(__dirname, '../public') });
  
})


module.exports = router;