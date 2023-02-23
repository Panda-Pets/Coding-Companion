const db = require('../models/dbModel');
const { post } = require('../server');

const gameController = {};

gameController.load = async (req, res, next) => {
  //initializes the initialLoad to an empty object
  res.locals.initialLoad = {};
  try {
    //looks for all the backgrounds from the background table
    const backgroundResponse = await db.query('SELECT * FROM background');
    //assigns the initialLoad.backgrounds to be the evaluated result of the query for backgrounds
    res.locals.initialLoad.backgrounds = backgroundResponse.rows;
    //TODO: swap the toys and food
    const toyResponse = await db.query('SELECT * FROM food');
    res.locals.initialLoad.food = toyResponse.rows;
    const foodResponse = await db.query('SELECT * FROM toys');
    res.locals.initialLoad.toys = foodResponse.rows;
    const petResponse = await db.query('SELECT * FROM pet_type');
    res.locals.initialLoad.pets = petResponse.rows;
    return next();
  } catch (error) {
    console.log(error);
    const err = {
      log: 'gameController.load',
      message: error,
    };
    next(err);
  }
};

gameController.populateInventory = async (req, res, next) => {
  const sqlStringPetReq = 'SELECT u.user_id, p.* FROM users u INNER JOIN unique_pets p ON p.user_id = u.user_id WHERE u.user_id = $1';
  const sqlStringItemReq = 'SELECT u.user_id, i.* FROM users u INNER JOIN unique_items i ON i.user_id = u.user_id WHERE u.user_id = $1';
  const values = [req.params.id];
  //default inventory as empty arrays
  //TODO: populate default inventory on signup
  res.locals.populatedInventory = {
    food: [],
    toys: [],
    pets: [],
    background: [],
  };
  try {
    //userPets is assigned the result of the query sqlStringPetReq and that will be pushed into the pets array
    const userPets = await db.query(sqlStringPetReq, values);

    res.locals.populatedInventory.pets.push(...userPets.rows);

    //userInventory is assigned the result of the query sqlStringItemReq and that will be destructured via a forEach method
    //inside the forEach method, we are pushing each object into their respective array based on type
    const userInventory = await db.query(sqlStringItemReq, values);
    userInventory.rows.forEach((element) => {
      if (element.type === 'food') res.locals.populatedInventory.food.push(element);
      if (element.type === 'toy') res.locals.populatedInventory.toys.push(element);
      if (element.type === 'background') res.locals.populatedInventory.background.push(element);
    });

    return next();
  } catch (error) {
    console.log(error);
    const err = {
      log: 'gameController.populateInventory',
      message: error,
    };
    next(err);
  }
};

gameController.addInventory = async (req, res, next) => {
  let postConstructor = {};

  console.log('req.body: ', req.body);

  if (req.body.type === 'food') {
    postConstructor = {
      cost: req.body.cost,
      toy_stat: 0,
      food_stat: req.body.food_stat,
      type: 'food',
      file_id: req.body.file_id,
      user_id: req.params.id,
    };
  } else if (req.body.type === 'background') {
    postConstructor = {
      cost: req.body.cost,
      toy_stat: 0,
      food_stat: 0,
      type: 'background',
      file_id: req.body.file_id,
      user_id: req.params.id,
    };
  } else if (req.body.type === 'toy') {
    postConstructor = {
      cost: req.body.cost,
      toy_stat: req.body.toy_stat,
      food_stat: 0,
      type: 'toy',
      file_id: req.body.file_id,
      user_id: req.params.id,
    };
  }

  try {
    //grab current currency in database
    console.log('req.params.id: ',req.params.id);
    const queryStrCurrency = 'SELECT currency FROM users WHERE user_id = $1';
    const values2 = [req.params.id];
    const data = await db.query(queryStrCurrency, values2);
    let currentCurrency = data.rows[0].currency;
    currentCurrency -= req.body.cost;
    // update user currency
    const sqlStringUpdateCurrency = 'UPDATE users SET currency=$1 WHERE user_id = $2';
    const values = [currentCurrency, req.params.id];
    const updatedCurrency = await db.query(sqlStringUpdateCurrency, values);
    // insert unique item
    const sqlStringAddInventory = 'INSERT INTO unique_items (cost, toy_stat, food_stat, type, file_id, user_id) VALUES ($1, $2, $3, $4, $5, $6)';
    const itemVals = Object.values(postConstructor);
    const addedItem = await db.query(sqlStringAddInventory, itemVals);
    res.locals.addedItem = [updatedCurrency, addedItem];

    return next();
  } catch (error) {
    console.log(error);
    const err = {
      log: 'gameController.populateInventory',
      message: error,
    };
    console.error(error);
    next(err);
  }
};

module.exports = gameController;
