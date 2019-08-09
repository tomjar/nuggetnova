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
                        'ip_address': item.ip_address,
                        'createtimestamp': item.createtimestamp.toLocaleString('en-US', { timeZone: 'UTC' }),
                        'description': item.description,
                        'category': item.category,
                    }
                });

            callback(null, all);
        })
    },
    insertEvent: function (ipaddress, category, description, callback) {
        let params = [ipaddress, category, description];
        db.query('INSERT INTO nn."Event"(id, ip_address, category, description, createtimestamp)'
            + 'VALUES (uuid_generate_v1(), $1, $2, $3, now());',
            params, (err, qres) => {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, qres);
                }
            })
    }
}

module.exports = EventData;