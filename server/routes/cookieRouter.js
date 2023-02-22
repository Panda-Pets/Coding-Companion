const express = require('express');
const cookieController = require('../controllers/cookieControllers.js');
const userController = require('../controllers/userControllers.js');
const router = express.Router();


// set long term login 
router.post('/login', cookieController.setSSIDCookie, (req, res) => {
  res.send(201).json({info: 'here'});
});

router.get('/', cookieController.signin, (req, res) => {
  res.send(201).json({info: 'here'});
});

//logout route



module.exports = router;