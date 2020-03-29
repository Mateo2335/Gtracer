const express = require('express');
const router = express.Router();
const path = require('path')
const pool = require('../database');


//Ruta de registre per enmagatzemar dades a la bdd

router.post('/register', async (req, res, next) => {
  console.log(req.body);
  const { emailUser, passwordUser, nomUser } = req.body;

  const emailUserWith = "'" + emailUser + "'"
  const passUserWith = "'" + passwordUser + "'"
  const nomUserWith = "'" + nomUser + "'"
  
  await pool.query('INSERT INTO dades_user (emailUser, passwordUser, nomUser) VALUES ('+emailUserWith+','+passUserWith+','+nomUserWith+');', (err, res) => {
    if(err){
      console.log(err.stack)
    }
    else {
      console.log(res.rows[0])
    }
  });
  res.send('recieved')
  next();

})





//Ruta de login per validar la autentificació de l'usuari

router.post('/login', async (req, res) => {
  console.log(req.body);
  const { emailUser, passwordUser } = req.body;
  const newLink = {
    emailUser,
    passwordUser,

  };


})

router.get('/api', (req, res, next) =>{
  res.sendFile('index.html', { root: path.join(__dirname, '../public') });
  
})






module.exports = router;