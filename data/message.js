var connection = require('../db/connection.js');

const db = connection.getDataBaseConnection();

var MessageData = {
    getAll: function (callback) {
        db.query('SELECT id, ip_address, createtimestamp, body, createdby FROM nn."Message" ORDER BY createtimestamp DESC;', (err, qres) => {
            if (err) {
                callback(err, {});
            }

            let data = qres.rows,
                all = data.map(item => {
                    return {
                        'id': item.id,
                        'ip_address': item.ip_address,
                        'createtimestamp': item.createtimestamp.toLocaleString('en-US', { timeZone: 'UTC' }),
                        'body': item.body,
                        'createdby': item.createdby,
                    }
                });

            callback(null, all);
        })
    }
}

module.exports = MessageData;