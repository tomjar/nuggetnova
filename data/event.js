var connection = require('../db/connection.js');

const db = connection.getDataBaseConnection();

var EventData = {
    getAll: function (callback) {
        db.query('SELECT id, ip_address, createtimestamp, category, description FROM nn."Event" ORDER BY createtimestamp DESC;', (err, qres) => {
            if (err) {
                callback(err, {});
            }

            let data = qres.rows,
                all = data.map(item => {
                    return {
                        'id': item.id,
                        'ip_address': item.ip_adress,
                        'createtimestamp': item.createtimestamp.toLocaleString('en-US', { timeZone: 'UTC' }),
                        'description': item.description,
                        'category': item.category,
                    }
                });

            callback(null, all);
        })
    }
}

module.exports = EventData;