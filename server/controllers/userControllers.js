const bcrypt = require('bcryptjs');
const db = require('../models/dbModel');

const SALT_WORK_FACTOR = 10;

const userController = {};



userController.signup = async (req, res, next) => {
  // this req.body should contain the user's username and password
  try {
    const {username, password, leetcodeUsername} = req.body;
    // checks for valid leetcode username
    const leetcodeUsernameCheck = await fetch(`https://leetcode.com/${leetcodeUsername}`);
    if (leetcodeUsernameCheck.status === 404) return next({log: 'Leetcode username is invalid', message : {err: 'Leetcode username is invalid. Please sign up with valid Leetcode username.'}});
    // checks for if username is already taken
    const usernameCheckQuery = 'SELECT * FROM users WHERE users.username = $1;';
    const usernameCheckValue = [username];
    const checkUsername = await db.query(usernameCheckQuery, usernameCheckValue);
    if (checkUsername.rows.length > 0) {
      return next({log: 'Username is taken', message : {err: 'Username is taken. Please try signing up with a different username.'}});
    }
    // hashes password and inserts new user into database
    const hashedPassword = await bcrypt.hash(password, SALT_WORK_FACTOR); // this autogenerates the salt and returns the hashed password in one function
    const queryString = 'INSERT INTO users(username, password, leetcodeusername, isadmin, currency, easycount, medcount, hardcount) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;';
    const values = [username, hashedPassword, leetcodeUsername, false, 0, 0, 0, 0];
    const data = await db.query(queryString, values);
    res.locals.currentUser = data.rows[0];
    return next();
  } catch (err) {
    return next({
      log: 'userController.signup',
      message: err
    });
  }  
};

//checks the login information to the saved info in the user database
userController.login = async (req, res, next) => {
  try {
    const {username, password} = req.params;
    const usernameCheckValue = [username];
    const usernameCheckQuery = 'SELECT * FROM users WHERE users.username = $1;';
    const user = await db.query(usernameCheckQuery, usernameCheckValue);
    const passwordIsValid = await bcrypt.compare(password, user.rows[0].password);  // will return true if password matches
    //checks if the password is false or if there is no user matching the input param username.
    if (!passwordIsValid || user.rows.length === 0) return next({log: 'Username or password is invalid', message : {err: 'Username or password is invalid. Please login with a valid username and password.'}});
    //stores the data onto local storage if user and pass is successful
    res.locals.currentUser = user.rows[0];
    return next(); 
  } catch (err) {
    return next({
      log: 'userController.login',
      message: err
    });
  }
};

// this middleware gets the difference in problems solved between last session and current session
userController.updateStats = async (req, res, next) => {
  try {
    const [currEasy, currMedium, currHard] = [res.locals.currentStats[1].count, res.locals.currentStats[2].count, res.locals.currentStats[3].count];
    const [prevEasy, prevMedium, prevHard] = [res.locals.currentUser.easycount, res.locals.currentUser.medcount, res.locals.currentUser.hardcount];
    //calculates the difference of the total of new problems solved vs the previously stored number of problems solved
    // const problemDiff = {
    //   easy: res.locals.currentStats[1].count - res.locals.currentUser.easycount, 
    //   medium: res.locals.currentStats[2].count - res.locals.currentUser.medcount,
    //   hard: res.locals.currentStats[3].count - res.locals.currentUser.hardcount
    // };
    // const problemDiff = {
    //   easy: currEasy - res.locals.currentUser.easycount, 
    //   medium: currMedium - res.locals.currentUser.medcount,
    //   hard: currHard - res.locals.currentUser.hardcount
    // };
    const problemDiff = {
      easy: currEasy - prevEasy, 
      medium: currMedium - prevMedium,
      hard: currHard - prevHard
    };
    res.locals.problemDiff = problemDiff;
    //
    // const values = [problemDiff.easy + res.locals.currentUser.easycount, problemDiff.medium + res.locals.currentUser.medcount, problemDiff.hard + res.locals.currentUser.hardcount, res.locals.currentUser.username];
    const values = [currEasy, currMedium, currHard, res.locals.currentUser.username];
    
    const queryString = 'UPDATE users SET easycount = $1, medcount = $2, hardcount = $3 WHERE username = $4 RETURNING *;';
    const data = await db.query(queryString, values);

    res.locals.currentUser = data.rows[0];

    return next();
  } catch (err) {
    return next({
      log: 'userController.updateStats',
      message: err
    });
  }
};


// this middleware calculates currency gained based on the problems solved since last session
userController.gainCurrency = async (req, res, next) => {
  try {
    let gainedCurrency = 0;
    const converter = {
      easy: 5,
      medium: 10,
      hard: 50,
    };
    //calculates the currency gained from the number of each difficulty problems solved to their corresponding value
    for (const key in res.locals.problemDiff) {
      gainedCurrency += converter[key] * res.locals.problemDiff[key]; // converter amount multiplied by new problems solved
    }
    const queryString = 'UPDATE users SET currency = $1 WHERE username = $2 RETURNING *;';
    const values = [gainedCurrency + res.locals.currentUser.currency, res.locals.currentUser.username];
    const data = await db.query(queryString, values);
    res.locals.currentUser = data.rows[0];
    res.locals.gainedCurrency = gainedCurrency;
    return next();
  } catch(err) {
    return next({
      log: 'userController.gainCurrency',
      message: err
    });
  }
};

// this middleware adds new pet to the database
userController.createPet = async (req, res, next) => {
  const { petType, petName, user_id } = req.body;
  const size = Math.floor(Math.random() * 20) + 20;
  const happiness = Math.floor(Math.random() * 10) + 90;
  const age = Math.floor(Math.random() * 9) + 1;
  const cost = 50;
  const queryString = 'INSERT INTO unique_pets(name, size, happiness, age, cost, file_id, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7)';
  const values = [petName, size, happiness, age, cost, petType, user_id];
  try {
    await db.query(queryString, values);
  } catch(err) {
    return next({
      log: 'userController.createPet',
      message: err
    });
  }
};
// create a function that registers an admin user
// userController.admin = (req, res, next) => {
//   res.locals.adminProfile = 'success';
//   return next()
// }


module.exports = userController;

