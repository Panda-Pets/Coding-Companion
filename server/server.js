require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const PORT = 3000;

const userRouter = require('./routes/userRouter.js');
const gameRouter = require('./routes/gameRouter');
// const cookieRouter = require('./routes/cookieRouter.js')

// const cors = require('cors');

/**
 * handle parsing request body
 */
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', gameRouter);

app.use('/inventory', gameRouter);

//server index html
app.get('/', (req, res) => {
  return res.status(200).sendFile(path.resolve(__dirname, '../client/index.html'));
});

app.get('/styles.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css');
  return res.status(200).sendFile(path.resolve(__dirname, '../client/styles.css'));
});

app.use('/user', userRouter);

// process form inputs
app.use('/*', (req, res) => res.status(404).send('This is not the page you\'re looking for...'));

//Express global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

/* start server */
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}...`);
});

module.exports = app;
