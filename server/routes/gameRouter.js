const express = require('express');
const gameController = require('../controllers/gameControllers.js');
const router = express.Router();



router.get('/', gameController.load, (req, res) => {
  res.status(200).json(res.locals.initialLoad);
});

router.get('/:id', gameController.populateInventory, (req, res) => {
  res.status(200).json(res.locals.populatedInventory);
});

router.post('/:id', gameController.addInventory, (req, res) => {
  res.status(200).json(res.locals.addedItem);
});


module.exports = router;