var connection = require('../db/connection.js');

const db = connection.getDataBaseConnection();

var PostData = {
    deletePostPermanently: function(id, callback){
        db.query('DELETE FROM nn."Post" WHERE id = $1;',
    [id], (err, qres) => {
        callback(err, qres);
    })
    },
    updatePostPublished: function (ispublished, id, callback) {
        db.query('UPDATE nn."Post" SET ispublished=$1, modifytimestamp=now() WHERE id = $2;',
            [ispublished, id], (err, qres) => {
                callback(err, qres);
            })
    },
    updatePostModifiedTimestamp: function (id, callback) {
        db.query('UPDATE nn."Post" SET modifytimestamp=now() WHERE id = $1;',
            [id], (err, qres) => {
                callback(err, qres);
            })
    },
    updatePost: function (category, header, ispublished, description, body, id, callback) {
        db.query('UPDATE nn."Post" SET category=$1, header=$2, modifytimestamp=now(), ispublished=$3, description=$4, body=$5 WHERE id = $6;',
            [category, header, ispublished, description, body, id], (err, qres) => {
                callback(err, qres);
            })
    },
    insertPost: function (header, description, name, category, body, callback) {
        db.query('INSERT INTO nn."Post"(id, header, createtimestamp, modifytimestamp, ispublished, description, name, category, body) '
            + 'VALUES (uuid_generate_v1(), $1, now(), NULL, false, $2, $3, $4, $5);',
            [header, description, name, category, body], (err, qres) => {
                callback(err, qres);
            })
    },
    getPostById: function (id, callback) {
        db.query('SELECT id, header, createtimestamp, modifytimestamp, ispublished, description, name, category, body FROM nn."Post" WHERE id=$1;',
            [id], (err, qres) => {
                let data = typeof qres === 'undefined' ? null : qres.rows[0];
                callback(err, data);
            })
    },
    getPostByName: function (name, callback) {
        db.query('SELECT id, header, createtimestamp, modifytimestamp, ispublished, description, name, category, body FROM nn."Post" WHERE lower(name)=$1;',
            [name], (err, qres) => {
                let data = typeof qres === 'undefined' ? null : qres.rows[0];
                callback(err, data);
            })
    },
    getAll: function (callback) {
        db.query('SELECT id, header, createtimestamp, modifytimestamp, ispublished, description, name, category, body FROM nn."Post" ORDER BY createtimestamp DESC;', (err, qres) => {
            if (err) {
                callback(err, {});
            }

            let data = qres.rows,
                today = new Date(),
                all = data.map(item => {
                    return {
                        'id': item.id,
                        'header': item.header,
                        'ispublished': item.ispublished,
                        'createtimestamp': item.createtimestamp.toLocaleString('en-US', { timeZone: 'UTC' }),
                        'modifytimestamp': item.modifytimestamp ? item.modifytimestamp.toLocaleString('en-US', { timeZone: 'UTC' }) : '',
                        'description': item.description,
                        'name': item.name,
                        'categoryImg': `/images/categories/${item.category}.png`,
                        'category': item.category,
                        'body': item.body
                    }
                });

            callback(null, all);
        })
    },
    getAllPublished: function (callback) {
        db.query('SELECT id, header, createtimestamp, modifytimestamp, ispublished, description, name, category FROM nn."Post" WHERE ispublished = true ORDER BY createtimestamp DESC;', (err, qres) => {
            if (err) {
                callback(err, {});
            }

            let data = qres.rows,
                today = new Date(),
                all = data.map(item => {
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

            callback(null, all);
        })
    },
    getAllPublishedLastThirtyDays: function (callback) {
        db.query('SELECT id, header, createtimestamp, modifytimestamp, ispublished, description, name, category FROM nn."Post" WHERE ispublished = true ORDER BY createtimestamp DESC;', (err, qres) => {
            if (err) {
                callback(err, {});
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

            callback(null, lastThirtyDays);
        })
    },

    getAllArchived: function (callback) {
        db.query('SELECT id, header, ispublished, description, createtimestamp, name, category FROM nn."Post" WHERE ispublished = true ORDER BY createtimestamp DESC;', (err, qres) => {
            if (err) {
                callback(err, {});
            }

            let data = qres.rows,
                uniqueYears = data.map(item => {
                    return item.createtimestamp.getFullYear();
                }).filter((item, index, arr) => {
                    return arr.indexOf(item) === index;
                }),
                yearAndPosts = uniqueYears.map(uy => {
                    return {
                        'year': uy, 'posts': data.map(d => {
                            return {
                                'id': d.id,
                                'header': d.header,
                                'ispublished': d.ispublished,
                                'description': d.description,
                                'createtimestamp': d.createtimestamp,
                                'name': d.name,
                                'category': d.category,
                                'categoryImg': `/images/categories/${d.category}.png`,
                            }
                        }).filter(p => {
                            return p.createtimestamp.getFullYear() === uy;
                        })
                    }
                });

            callback(null, yearAndPosts);
        })
    }
}

module.exports = PostData;