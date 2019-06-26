var express = require('express');
var router = express.Router();
var pd = require('../data/post.js');
var filesys = require('fs');

// view
router.get('/:name', (req, res, next) => {
    let name = req.params.name;

    pd.getPostByName(name, function (err, viewmodel) {
        if (err) {
            return next(err);
        }

        pd.getAllArchived(function (err, yearAndPosts) {
            if (err) {
                return next(err);
            }

            let path = `views/p/${viewmodel.name}.vash`;

            filesys.readFile(path, (err1, content) => {
                if (err1) {
                    filesys.writeFile(path, '<p></p>', (err2) => {
                        if (err2) {
                            return next(err2);
                        } else {
                            res.render('pub', {
                                title: viewmodel.header,
                                isauthenticated: req.session.isauthenticated,
                                post: viewmodel,
                                yearAndPosts: yearAndPosts
                            });
                        }
                    })
                } else {
                    res.render('pub', {
                        title: viewmodel.header,
                        isauthenticated: req.session.isauthenticated,
                        post: viewmodel,
                        yearAndPosts: yearAndPosts
                    });
                }
            })
        })
    })
});

module.exports = router;