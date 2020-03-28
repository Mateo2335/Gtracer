const express = require('express');
const router = express.Router();
const path = require('path')
const pool = require('../database');

router.post('/register', async (req, res) => {
  console.log(req.body);
  const { emailUser, passwordUser } = req.body;
  const newLink = {
    emailUser,
    passwordUser,

  };


  await pool.query('INSERT INTO dades_user set ?', [newLink]);
  res.send('recieved')

})

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