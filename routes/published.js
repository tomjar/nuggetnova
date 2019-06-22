var express = require('express');
var router = express.Router();
var app = express();
var connection = require('../db/connection.js');

const db = connection.getDataBaseConnection(app);

// view
router.get('/:name', (req, res, next) => {
    let name = req.params.name;
    console.log(name);
    db.query('SELECT id, header, createtimestamp, modifytimestamp, ispublished, description, name FROM nn."Post" WHERE name=$1;',
        [name], (err, qres) => {
            if (err) {
                return next(err)
            }

            let data = qres.rows,
                viewmodel = data.map(d => {
                    return {
                        'postid': d.id,
                        'description': d.description,
                        'header': d.header,
                        'name': d.name
                    }
                })[0];

            if (data.length <= 0) {
                return next('');
            }

            res.render(`p/${viewmodel.name}`, {
                title: viewmodel.header,
                isauthenticated: req.session.isauthenticated,
                post: viewmodel
            });
        })
});

module.exports = router;