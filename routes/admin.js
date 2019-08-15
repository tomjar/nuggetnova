var express = require('express');
var router = express.Router();
var auth = require('../data/auth.js');
var ed = require('../data/event.js');
var sd = require('../data/settings.js');
var md = require('../data/message.js');
var pd = require('../data/post.js');
var tte = require('../enums/toastrtypeenum.js');
var pce = require('../enums/postcategoryenum.js');

// index admin dashboard
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

// all posts
router.get('/posts', (req, res, next) => {
    if (req.session.isauthenticated) {
        pd.getAll(function (err, all) {
            if (err) {
                return next(err);
            } else {
                res.render('admin/posts', {
                    title: 'all posts',
                    isauthenticated: req.session.isauthenticated,
                    posts: all
                });
            }
        })
    } else {
        res.redirect('/');
    }
});

// add
router.get('/add', (req, res, next) => {
    if (req.session.isauthenticated) {
        res.render('admin/add', {
            'title': 'add new post',
            'isauthenticated': req.session.isauthenticated,
            'categories': [
                { 'value': pce.Bicycle.toLowerCase(), 'name': pce.Bicycle.toLowerCase() },
                { 'value': pce.Code.toLowerCase(), 'name': pce.Code.toLowerCase() },
                { 'value': pce.Gaming.toLowerCase(), 'name': pce.Gaming.toLowerCase() },
                { 'value': pce.Hardware.toLowerCase(), 'name': pce.Hardware.toLowerCase() },
                { 'value': pce.Life.toLowerCase(), 'name': pce.Life.toLowerCase() },
                { 'value': pce.Review.toLowerCase(), 'name': pce.Review.toLowerCase() }
            ]
        });
    } else {
        res.redirect('/');
    }
}).post('/add', (req, res, next) => {
    if (req.session.isauthenticated) {
        let postHeader = req.body.postHeader,
            postDescription = req.body.postDescription,
            postName = req.body.postName,
            postCategory = req.body.postCategory,
            postBody = req.body.postBody;

        pd.insertPost(postHeader, postDescription, postName, postCategory, postBody, function (err) {
            if (err) {
                return next(err);
            } else {
                res.redirect('/post');
            }
        })
    } else {
        res.redirect('/');
    }
});

// update
router.get('/update/:id', (req, res, next) => {
    if (req.session.isauthenticated) {
        let id = req.params.id;

        pd.getPostById(id, function (err, post) {
            if (err) {
                return next(err);
            } else {
                let viewmodel = {
                    'id': post.id,
                    'header': post.header,
                    'ispublished': post.ispublished,
                    'description': post.description,
                    'name': post.name,
                    'category': post.category,
                    'body': post.body,
                    'categories': [
                        { 'value': pce.Bicycle.toLowerCase(), 'name': pce.Bicycle.toLowerCase() },
                        { 'value': pce.Code.toLowerCase(), 'name': pce.Code.toLowerCase() },
                        { 'value': pce.Gaming.toLowerCase(), 'name': pce.Gaming.toLowerCase() },
                        { 'value': pce.Hardware.toLowerCase(), 'name': pce.Hardware.toLowerCase() },
                        { 'value': pce.Life.toLowerCase(), 'name': pce.Life.toLowerCase() },
                        { 'value': pce.Review.toLowerCase(), 'name': pce.Review.toLowerCase() }
                    ]
                };

                res.render('admin/edit', {
                    title: viewmodel.header,
                    isauthenticated: req.session.isauthenticated,
                    post: viewmodel
                });

            }
        })
    } else {
        res.redirect('/');
    }
}).post('/update', (req, res, next) => {
    if (req.session.isauthenticated) {
        let postHeader = req.body.postHeader,
            postIsPublished = req.body.postIsPublished,
            postDescription = req.body.postDescription,
            postId = req.body.postId,
            postCategory = req.body.postCategory,
            postBody = req.body.postBody;

        pd.updatePost(postCategory, postHeader, postIsPublished, postDescription, postBody, postId, function (err, result) {
            if (err) {
                return next(err);
            } else {
                res.redirect('/');
            }
        });
    } else {
        res.redirect('/');
    }
});

// activate
router.get('/activate/:id', (req, res, next) => {
    if (req.session.isauthenticated) {
        let id = req.params.id;
        pd.updatePostPublished(true, id, function (err, result) {
            if (err) {
                return next(err);
            } else {
                res.redirect('/post');
            }
        })
    } else {
        res.redirect('/');
    }
});

// deactivate
router.get('/deactivate/:id', (req, res, next) => {
    if (req.session.isauthenticated) {
        let id = req.params.id;
        pd.updatePostPublished(false, id, function (err, result) {
            if (err) {
                return next(err);
            } else {
                res.redirect('/post');
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
            ],
            'toastr_messages': req.session.toastr_messages
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
                    req.session.toastr_messages = null;
                    res.render('admin/settings', settingsViewModel);
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
                req.session.toastr_messages = JSON.stringify(
                    [
                        { type: tte.Success, msg: 'The settings, where successfully updated!' }
                    ]
                );
                res.redirect('/admin/settings');
            }
        });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
