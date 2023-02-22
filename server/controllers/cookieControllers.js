const express = require('express');

const cookieController = {};

cookieController.setSSIDCookie = (req, res, next) => {
  // res.cookie('ssid', res.locals.userId, {httpOnly: true} );
  return next();
};

module.exports = cookieController;