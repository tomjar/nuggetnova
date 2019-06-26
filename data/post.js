var connection = require('../db/connection.js');

const db = connection.getDataBaseConnection();

var PostData = {
    getPostById: function (id, callback) {
        db.query('SELECT id, header, createtimestamp, modifytimestamp, ispublished, description, name, category FROM nn."Post" WHERE id=$1;',
            [id], (err, qres) => {
                if (err) {
                    callback(err, {});
                }

                let data = qres.rows,
                    viewmodel = data.map(d => {
                        return {
                            'postid': d.id,
                            'description': d.description,
                            'header': d.header,
                            'name': d.name,
                            'createtimestamp': d.createtimestamp,
                            'category': d.category
                        }
                    })[0];

                if (data.length <= 0) {
                    callback('Not found', {});
                }

                callback(null, viewmodel);

            })
    },
    getPostByName: function (name, callback) {
        db.query('SELECT id, header, createtimestamp, modifytimestamp, ispublished, description, name, category FROM nn."Post" WHERE name=$1;',
            [name], (err, qres) => {
                if (err) {
                    callback(err, {});
                }

                let data = qres.rows,
                    viewmodel = data.map(d => {
                        return {
                            'postid': d.id,
                            'description': d.description,
                            'header': d.header,
                            'name': d.name,
                            'createtimestamp': d.createtimestamp.toLocaleString('en-US', { timeZone: 'UTC' }),
                            '': d.modifytimestamp ? d.modifytimestamp.toLocaleString('en-US', { timeZone: 'UTC' }) : '',
                            'category': d.category
                        }
                    })[0];

                if (data.length <= 0) {
                    callback('Not found', {});
                }

                callback(null, viewmodel);
            })
    },
    getAll: function (callback) {
        db.query('SELECT id, header, createtimestamp, modifytimestamp, ispublished, description, name, category FROM nn."Post" ORDER BY createtimestamp DESC;', (err, qres) => {
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
        db.query('SELECT id, header, createtimestamp, modifytimestamp, ispublished, description, name, category FROM nn."Post" WHERE ispublished = true ORDER BY createtimestamp DESC;', (err, qres) => {
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
                        'year': uy, 'posts': data.filter(p => {
                            return p.createtimestamp.getFullYear() === uy;
                        })
                    }
                });

            callback(null, yearAndPosts);
        })
    }
}

module.exports = PostData;