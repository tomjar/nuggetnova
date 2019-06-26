var express = require('express');
var router = express.Router();
var pd = require('../data/post.js');

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

            res.render('pub', {
                title: viewmodel.header,
                isauthenticated: req.session.isauthenticated,
                post: viewmodel,
                yearAndPosts: yearAndPosts
            });
        })
    })
});

module.exports = router;