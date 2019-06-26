var express = require('express');
var router = express.Router();
var auth = require('../auth/index.js');
var connection = require('../db/connection.js');
var pd = require('../data/post.js');

const db = connection.getDataBaseConnection();

// salts
router.get('/salts', (req, res, next) => {
  if (req.session.isauthenticated) {
    let salts = [
      auth.generateRandomSalt(100),
      auth.generateRandomSalt(100),
      auth.generateRandomSalt(100),
      auth.generateRandomSalt(100),
      auth.generateRandomSalt(100),
      auth.generateRandomSalt(100),
      auth.generateRandomSalt(100),
      auth.generateRandomSalt(100),
      auth.generateRandomSalt(100),
      auth.generateRandomSalt(100),
      auth.generateRandomSalt(100),
      auth.generateRandomSalt(100)];

    res.render('salts', {
      title: 'random salts',
      isauthenticated: req.session.isauthenticated,
      salts: salts
    })
  } else {
    res.redirect('/');
  }
})

// home
router.get('/', (req, res, next) => {
  pd.getAllPublishedLastThirtyDays(function (err, lastThirtyDays) {

    if (err) {
      return next(err);
    }

    pd.getAllArchived(function (err, yearAndPosts) {

      if (err) {
        return next(err);
      }

      res.render('index', {
        title: 'recent',
        isauthenticated: req.session.isauthenticated,
        posts: lastThirtyDays,
        yearAndPosts: yearAndPosts
      });
    })
  })
});

// about
router.get('/about', (req, res, next) => {
  res.render('about', {
    title: 'about',
    isauthenticated: req.session.isauthenticated
  });
});

// logout
router.get('/logout', (req, res, next) => {
  req.session.destroy(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

// login
router.get('/login', (req, res, next) => {
  // TODO: check if user in the naughty list
  res.render('login', { title: 'Login' });
}).post('/login', (req, res, next) => {
  // TODO: check if user in the naughty list
  auth.validatePassword(req.body.secretKey, db, function (valid) {
    if (valid) {
      // welcome valid user
      req.session.isauthenticated = true;
      res.redirect('../');
    } else {
      // TODO: log it
      // TODO: lock out of login page
      // TODO: warn the user
      // TODO: add to naughty list
      res.redirect('../');
    }
  });
});

module.exports = router;