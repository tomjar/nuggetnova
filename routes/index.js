var express = require('express');
var router = express.Router();
var auth = require('../data/auth.js');
var pd = require('../data/post.js');
var sd = require('../data/settings.js');
var ed = require('../data/event.js');
var enm = require('../enums/eventcategoryenum.js');
var tte = require('../enums/toastrtypeenum.js');

// home
router.get('/', (req, res, next) => {
  pd.getAllPublishedLastThirtyDays(function (err, lastThirtyDays) {
    if (err) {
      return next(err);
    } else {
      pd.getAllArchived(function (err, yearAndPosts) {
        if (err) {
          return next(err);
        } else {

          var homeViewModel = {
            'title': 'recent',
            'isauthenticated': req.session.isauthenticated,
            'posts': lastThirtyDays,
            'yearAndPosts': yearAndPosts,
            'toastr_messages': req.session.toastr_messages
          };

          req.session.toastr_messages = null;

          res.render('index', homeViewModel);
        }
      })
    }
  })
});

// view
router.get('/:name', (req, res, next) => {
  let name = req.params.name.toLowerCase().trim(),
    reservedPages = ['login', 'about', 'contact', 'logout', 'admin'],
    isReserved = reservedPages.find(function (element) {
      return element === name;
    });

  if (typeof isReserved !== 'undefined') {
    // continue and see if we can find the reserved page requested
    return next();
  } else {
    pd.getPostByName(name, function (err, post) {
      if (err) {
        return next(err);
      }
      else if (typeof post === 'undefined') {
        return next();
      } else {
        pd.getAllArchived(function (err, yearAndPosts) {
          if (err) {
            return next(err);
          } else {

            let viewmodel = {
              'id': post.id,
              'description': post.description,
              'header': post.header,
              'name': post.name,
              'createtimestamp': post.createtimestamp.toLocaleString('en-US', { timeZone: 'UTC' }),
              'modifytimestamp': post.modifytimestamp
                ? post.modifytimestamp.toLocaleString('en-US', { timeZone: 'UTC' })
                : '',
              'category': post.category,
              'body': post.body
            };

            res.render('post/view', {
              title: viewmodel.header,
              isauthenticated: req.session.isauthenticated,
              post: viewmodel,
              yearAndPosts: yearAndPosts
            });
          }
        })
      }
    })
  }
});

// about
router.get('/about', (req, res, next) => {
  let aboutViewModel = {
    'title': 'about',
    'about_section': '',
    'isauthenticated': req.session.isauthenticated,
    'yearAndPosts': []
  };

  sd.getSettings(function (err, settings) {
    if (err) {
      return next(err);
    } else {
      pd.getAllArchived(function (err, yearAndPosts) {
        if (err) {
          return next(err);
        } else {
          aboutViewModel.yearAndPosts = yearAndPosts;
          try {
            aboutViewModel.about_section = settings.about_section;
          } catch (excep) {
            sd.insertDefaultSettings(function (err, result) {
              if (err) {
                return next(err);
              } else {
                aboutViewModel.about_section = result.defaultSettings[1];
              }
            })
          } finally {
            res.render('about', aboutViewModel);
          }
        }
      })
    }
  })
});

// logout
router.get('/logout', (req, res, next) => {
  req.session.destroy(function (err) {
    if (err) {
      return next(err);
    } else {
      res.redirect('/');
    }
  });
});

// login
router.get('/login', (req, res, next) => {
  if (req.session.lockout) {
    res.redirect('../');
  } else {
    let tstrmsgs = req.session.toastr_messages;
    req.session.toastr_messages = null;
    res.render('login',
      {
        title: 'login',

      });
  }
}).post('/login', (req, res, next) => {
  if (req.session.lockout) {
    res.redirect('../');
  } else {
    auth.validatePassword(req.body.secretKey, function (valid) {
      if (valid) {

        // welcome valid user
        req.session.isauthenticated = true;
        res.redirect('../');
      } else {
        req.session.lockout = true;

        req.session.toastr_messages = JSON.stringify(
          [
            {
              type: tte.Warning,
              msg: 'This failed login attempt has been logged.'
            }
          ]
        );

        let description = 'It appears someone attempted to login to the website and failed.',
          category = enm.LoginFailure,
          ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        ed.insertEvent(ipAddress, category, description, function (err, result) {
          if (err) {
            return next(err);
          } else {
            res.redirect('../');
          }
        });
      }
    });
  }
});

module.exports = router;