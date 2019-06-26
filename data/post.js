var connection = require('../db/connection.js');

const db = connection.getDataBaseConnection();

var PostData = {

    getAllPublished: function (callback) {
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