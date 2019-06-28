var express = require('express');
var router = express.Router();
var pd = require('../data/post.js');
var filesys = require('fs');

// view
router.get('/:name', (req, res, next) => {
    let name = req.params.name;

    pd.getPostByName(name, function (err, post) {
        if (err) {
            return next(err);
        } else {
            pd.getAllArchived(function (err, yearAndPosts) {
                if (err) {
                    return next(err);
                } else {
                    let path = `views/p/${post.name}.vash`;

                    filesys.readFile(path, (err1, content) => {
                        if (err1) {
                            filesys.writeFile(path, '', (err2) => {
                                if (err2) {
                                    return next(err2);
                                } else {

                                    let viewmodel = {
                                        'postid': post.id,
                                        'description': post.description,
                                        'header': post.header,
                                        'name': post.name,
                                        'createtimestamp': post.createtimestamp,
                                        'modifytimestamp': post.modifytimestamp,
                                        'category': post.category,
                                        'content': ''
                                    };

                                    res.render('pub', {
                                        title: viewmodel.header,
                                        isauthenticated: req.session.isauthenticated,
                                        post: viewmodel,
                                        yearAndPosts: yearAndPosts
                                    });
                                }
                            })
                        } else {

                            let viewmodel = {
                                'postid': post.id,
                                'description': post.description,
                                'header': post.header,
                                'name': post.name,
                                'createtimestamp': post.createtimestamp,
                                'modifytimestamp': post.modifytimestamp,
                                'category': post.category,
                                'content': content
                            };

                            res.render('pub', {
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
    })
});

module.exports = router;