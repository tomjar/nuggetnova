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
    },
    insertMessage: function (ipaddress, body, createdby, callback) {
        let params = [ipaddress, body, createdby];
        db.query('INSERT INTO nn."Message"(id, ip_address, body, createtimestamp, createdby)'
            + 'VALUES (uuid_generate_v1(), $1, $2, now(), $3);',
            params, (err, qres) => {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, qres);
                }
            })
    }
}

module.exports = MessageData;