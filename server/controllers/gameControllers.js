/* eslint-disable */
const db = require('../models/dbModel');
const { post } = require('../server');



const gameController = {};

gameController.load = async (req, res, next) => {
  res.locals.initialLoad = {}
try {
  const backgroundResponse = await db.query('SELECT * FROM background')
  res.locals.initialLoad.backgrounds = backgroundResponse.rows;
  const toyResponse = await db.query('SELECT * FROM food')
  res.locals.initialLoad.toys = toyResponse.rows;
  const foodResponse = await db.query('SELECT * FROM toys')
  res.locals.initialLoad.food = foodResponse.rows;
  const petResponse = await db.query('SELECT * FROM pet_type')
  res.locals.initialLoad.pets = petResponse.rows;
  return next();
  } catch (error) {
    console.log(error);
    const err = {
      log: 'gameController.load',
      message: 'check log for error'
    }
    next(err);
  }
};

gameController.populateInventory = async (req, res, next) => {
  sqlStringPetReq = `SELECT u.user_id, p.* FROM users u INNER JOIN unique_pets p ON p.user_id = u.user_id WHERE u.user_id = ${req.params.id}`;
  sqlStringItemReq = `SELECT u.user_id, i.* FROM users u INNER JOIN unique_items i ON i.user_id = u.user_id WHERE u.user_id = ${req.params.id}`
  res.locals.populatedInventory = {
    food: [],
    toys: [],
    pets: [],
    background: []
  }
try {
  const userPets = await db.query(sqlStringPetReq)
  res.locals.populatedInventory.pets.push(...userPets.rows);
  const userInventory = await db.query(sqlStringItemReq);
  userInventory.rows.forEach((element) => {
    if (element.type === 'food') res.locals.populatedInventory.food.push(element);
    if (element.type === 'toy') res.locals.populatedInventory.toys.push(element);
    if (element.type === 'background') res.locals.populatedInventory.background.push(element);
  })
  return next();
  } catch (error) {
    console.log(error);
    const err = {
      log: 'gameController.populateInventory',
      message: 'check log for error'
    }
    next(err);
  }
};

gameController.addInventory = async (req, res, next) => {

  let postConstructor = {}

  console.log('req.body: ', req.body)

  if(req.body.type === 'food') {
    postConstructor = {
      cost: req.body.cost,
      toy_stat: 0,
      food_stat: req.body.food_stat,
      type:'food',
      file_id: req.body.file_id,
      user_id: req.params.id
    }
  } else if(req.body.type === 'background') {
    postConstructor = {
      cost: req.body.cost,
      toy_stat: 0,
      food_stat: 0,
      type: 'background',
      file_id: req.body.file_id,
      user_id: req.params.id
    } 
  } else if(req.body.type === 'toy') {
    postConstructor = {
      cost: req.body.cost,
      toy_stat: req.body.toy_stat,
      food_stat: 0,
      type: 'toy',
      file_id: req.body.file_id,
      user_id: req.params.id
    }
  }
  
  
try {

  // update user currency
  sqlStringUpdateCurrency = `UPDATE users SET currency=$1 WHERE user_id=${req.params.id}`;
  const currencyVal = [req.body.currencyVal];
  const updatedCurrency = await db.query(sqlStringUpdateCurrency, currencyVal);

  // insert unique item
  sqlStringAddInventory = `INSERT INTO unique_items (cost, toy_stat, food_stat, type, file_id, user_id) VALUES ($1, $2, $3, $4, $5, $6)`
  const itemVals = Object.values(postConstructor);
  console.log('item vals: ', itemVals)
  const addedItem = await db.query(sqlStringAddInventory, itemVals)
  res.locals.addedItem = [updatedCurrency, addedItem];

  return next();
  } catch (error) {
    console.log(error);
    const err = {
      log: 'gameController.populateInventory',
      message: 'check log for error'
    }
    console.error(error);
    next(err);
  }
};

module.exports = gameController;