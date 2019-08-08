var express = require('express');
var router = express.Router();
var auth = require('../data/auth.js');
var ed = require('../data/event.js');
var sd = require('../data/settings.js');
var md = require('../data/message.js');

// home (events)
router.get('/', (req, res, next) => {
    if (req.session.isauthenticated) {
        ed.getAll(function (err, events) {
            if (err) {
                return next(err);
            } else {
                res.render('admin/index', {
                    'title': 'events',
                    'isauthenticated': req.session.isauthenticated,
                    'events': events
                })
            }
        })
    } else {
        res.redirect('/');
    }
});

// messages
router.get('/messages', (req, res, next) => {
    if (req.session.isauthenticated) {
        md.getAll(function (err, messages) {
            if (err) {
                return next(err);
            } else {
                res.render('admin/messages', {
                    'title': 'messages',
                    'isauthenticated': req.session.isauthenticated,
                    'messages': messages
                })
            }
        })
    } else {
        res.redirect('/');
    }
});

// settings
router.get('/settings', (req, res, next) => {
    if (req.session.isauthenticated) {
        sd.getSettings(function (err, settings) {
            if (err) {
                return next(err);
            } else {
                res.render('admin/settings', {
                    'title': 'settings',
                    'isauthenticated': req.session.isauthenticated,
                    'about_section': settings.about_section,
                    'archive_view': settings.archive_view,
                    'about_view_categories': [
                        { 'value': 'bicycle', 'name': 'bicycle' },
                        { 'value': 'code', 'name': 'code' },
                        { 'value': 'gaming', 'name': 'gaming' },
                        { 'value': 'hardware', 'name': 'hardware' },
                        { 'value': 'life', 'name': 'life' },
                        { 'value': 'review', 'name': 'review' }
                    ]
                })
            }
        })
    } else {
        res.redirect('/');
    }
});

module.exports = router;
