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
                    'events': events,
                    'toastr_messages': req.session.toastr_messages
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
        let settingsViewModel = {
            'title': 'settings',
            'isauthenticated': req.session.isauthenticated,
            'about_section': '',
            'archive_view': '',
            'archive_view_categories': [
                { 'value': 'category', 'name': 'category' },
                { 'value': 'date', 'name': 'date' }
            ]
        };
        sd.getSettings(function (err, settings) {
            if (err) {
                return next(err);
            } else {

                try {
                    settingsViewModel.about_section = settings.about_section;
                    settingsViewModel.archive_view = settings.archive_view;
                }
                catch (excep) {
                    sd.insertDefaultSettings(function (err, result) {
                        if (err) {
                            return next(err);
                        } else {
                            settingsViewModel.about_section = result.defaultSettings[1];
                            settingsViewModel.archive_view = result.defaultSettings[0];
                        }
                    })
                } finally {
                    res.render('admin/settings', settingsViewModel)
                }
            }
        })
    } else {
        res.redirect('/');
    }
}).post('/settings/update', (req, res, next) => {
    if (req.session.isauthenticated) {
        let archiveView = req.body.archiveView,
            aboutSection = req.body.aboutSection;

        sd.updateSettings(archiveView, aboutSection, function (err, result) {
            if (err) {
                return next(err);
            } else {
                req.session.toastr_messages = ['The settings where successfully updated!'];
                res.redirect('/');
            }
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;
