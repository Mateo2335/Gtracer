const express = require('express');
const router = express.Router();
const path = require('path')
const passport = require('passport')

//Ruta de register per guardar usuari

/* router.post('/register', passport.authenticate('local.signup', {
  failureFlash: true,
}))*/



//Ruta de login per validar la autentificació de l'usuari

/*router.post('/login', passport.authenticate('local.signin', {
    failureFlash: true,
}))*/

/*router.post('/login', function(req, res, next){
  passport.authenticate('local.signin', function(req, res){
    res.json('hola')
  })
  next()
})*/

/*router.post('/login', function(req, res, next) {
  passport.authenticate('local.signin', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/users/' + user.username);
    });
  })(req, res, next);
})*/

/*router.get('/api', (req, res, next) =>{
  res.sendFile('index.html', { root: path.join(__dirname, '../public') });
  
})*/

/*router.get('/username', (req, res, next) => {
  res.json(req.user)
  console.log(res.body)
  next()
})*/


module.exports = router;