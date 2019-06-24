var express = require('express');
var router = express.Router();
var auth = require('../auth/index.js');
var connection = require('../db/connection.js');

const db = connection.getDataBaseConnection();

// archive
router.get('/archive', (req, res, next) => {
  db.query('SELECT id, header, createtimestamp, modifytimestamp, ispublished, description, name FROM nn."Post" WHERE ispublished = true ORDER BY createtimestamp DESC;',
    [], (err, qres) => {
      if (err) {
        return next(err)
      }

      let data = qres.rows,
        uniqueYears = data.map(item => {
          return item.createtimestamp.getFullYear();
        }).filter((item, index, arr) => {
          return arr.indexOf(item) === index;
        }),

        yearAndPosts = uniqueYears.map(uy => {
          return {
            'year': uy, 'posts': data.filter(p => {
              return p.createtimestamp.getFullYear() === uy;
            })
          }
        });

      res.render('archive', {
        title: 'Archive',
        isauthenticated: req.session.isauthenticated,
        yearAndPosts: yearAndPosts
      });
    })
});

// salts
router.get('/salts', (req, res, next) => {
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
})

// home
router.get('/', (req, res, next) => {
  db.query('SELECT id, header, createtimestamp, modifytimestamp, ispublished, description, name, category FROM nn."Post" WHERE ispublished = true ORDER BY createtimestamp DESC;', (err, qres) => {
    if (err) {
      return next(err)
    }

    let data = qres.rows,
      today = new Date(),
      priorDate = new Date().setDate(today.getDate() - 30),

      lastThirtyDays = data.filter(item => {
        return item.createtimestamp.getTime() >= priorDate;
      }).map(item => {
        return {
          'id': item.id,
          'header': item.header,
          'createtimestamp': item.createtimestamp.toLocaleString('en-US', { timeZone: 'UTC' }),
          'modifytimestamp': item.modifytimestamp ? item.modifytimestamp.toLocaleString('en-US', { timeZone: 'UTC' }) : '',
          'description': item.description,
          'name': item.name,
          'categoryImg': `/images/categories/${item.category}.png`,
          'category': item.category
        }
      });

    res.render('index', {
      title: 'recent (last 30 days)',
      isauthenticated: req.session.isauthenticated,
      posts: lastThirtyDays
    });
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